import "server-only";

type MpesaTokenResponse = {
  access_token?: string;
  expires_in?: string;
};

type MpesaStkResponse = {
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  ResponseCode?: string;
  ResponseDescription?: string;
  CustomerMessage?: string;
  errorCode?: string;
  errorMessage?: string;
  requestId?: string;
  [key: string]: unknown;
};

export class MpesaApiError extends Error {
  status: number;
  providerResponse: MpesaStkResponse | Record<string, unknown> | null;

  constructor(
    message: string,
    status: number,
    providerResponse: MpesaStkResponse | Record<string, unknown> | null = null,
  ) {
    super(message);
    this.name = "MpesaApiError";
    this.status = status;
    this.providerResponse = providerResponse;
  }
}

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value || value === "N/A") {
    throw new Error(`Missing or invalid ${name}.`);
  }
  return value;
}

function getBaseUrl() {
  return process.env.MPESA_ENVIRONMENT === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

function getTimestamp() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}${values.month}${values.day}${values.hour}${values.minute}${values.second}`;
}

function getPassword(timestamp: string) {
  const shortcode = requiredEnv("MPESA_SHORTCODE");
  const passkey = requiredEnv("MPESA_PASSKEY");
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
}

async function readProviderResponse(response: Response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { raw: text };
  }
}

export async function getMpesaAccessToken() {
  const consumerKey = requiredEnv("MPESA_CONSUMER_KEY");
  const consumerSecret = requiredEnv("MPESA_CONSUMER_SECRET");
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const response = await fetch(
    `${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
      cache: "no-store",
    },
  );

  const data = await readProviderResponse(response);

  if (!response.ok) {
    throw new MpesaApiError(
      `M-Pesa token request failed with HTTP ${response.status}.`,
      response.status,
      data,
    );
  }

  const tokenData = (data ?? {}) as MpesaTokenResponse;

  if (!tokenData.access_token) {
    throw new MpesaApiError(
      "M-Pesa did not return an access token.",
      response.status,
      data,
    );
  }

  return tokenData.access_token;
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.startsWith("7") && digits.length === 9) return `254${digits}`;

  throw new Error("Enter a valid Kenyan M-Pesa phone number.");
}

export async function initiateMpesaStkPush(input: {
  amount: number;
  phone: string;
  accountReference: string;
  transactionDesc: string;
}) {
  const token = await getMpesaAccessToken();
  const timestamp = getTimestamp();
  const shortcode = requiredEnv("MPESA_SHORTCODE");
  const callbackUrl = requiredEnv("MPESA_CALLBACK_URL");
  const phone = normalizePhone(input.phone);
  const amount = Math.round(Number(input.amount));

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("M-Pesa amount must be greater than zero.");
  }

  if (!/^2547\d{8}$/.test(phone)) {
    throw new Error("M-Pesa phone must be a valid Kenyan Safaricom number.");
  }

  if (!/^https:\/\//i.test(callbackUrl)) {
    throw new Error("MPESA_CALLBACK_URL must be a public HTTPS URL.");
  }

  const transactionType =
    process.env.MPESA_TRANSACTION_TYPE?.trim() || "CustomerPayBillOnline";
  const partyB = process.env.MPESA_PARTY_B?.trim() || shortcode;

  const payload = {
    BusinessShortCode: shortcode,
    Password: getPassword(timestamp),
    Timestamp: timestamp,
    TransactionType: transactionType,
    Amount: amount,
    PartyA: phone,
    PartyB: partyB,
    PhoneNumber: phone,
    CallBackURL: callbackUrl,
    AccountReference: input.accountReference.slice(0, 12),
    TransactionDesc: input.transactionDesc.slice(0, 13),
  };

  console.info("M-Pesa STK request", {
    environment: process.env.MPESA_ENVIRONMENT === "production" ? "production" : "sandbox",
    transactionType,
    amount,
    phoneLast4: phone.slice(-4),
    shortcodeLast4: shortcode.slice(-4),
    callbackHost: new URL(callbackUrl).host,
  });

  const response = await fetch(
    `${getBaseUrl()}/mpesa/stkpush/v1/processrequest`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  const data = (await readProviderResponse(response)) as MpesaStkResponse | null;

  if (!response.ok) {
    const providerMessage =
      data?.errorMessage ||
      data?.ResponseDescription ||
      data?.CustomerMessage ||
      "Safaricom rejected the STK request.";

    throw new MpesaApiError(
      `M-Pesa STK request failed with HTTP ${response.status}: ${providerMessage}`,
      response.status,
      data,
    );
  }

  if (data?.ResponseCode && data.ResponseCode !== "0") {
    throw new MpesaApiError(
      data.ResponseDescription ||
        data.CustomerMessage ||
        "Safaricom rejected the STK request.",
      400,
      data,
    );
  }

  if (!data?.CheckoutRequestID) {
    throw new MpesaApiError(
      "Safaricom accepted the request but did not return a CheckoutRequestID.",
      502,
      data,
    );
  }

  return data;
}
