import "server-only";

type MpesaTokenResponse = {
  access_token: string;
  expires_in: string;
};

type MpesaStkResponse = {
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  ResponseCode?: string;
  ResponseDescription?: string;
  CustomerMessage?: string;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}.`);
  return value;
}

function getBaseUrl() {
  return (
    process.env.MPESA_ENVIRONMENT === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke"
  );
}

function getTimestamp() {
  const now = new Date();
  const parts = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    String(now.getUTCDate()).padStart(2, "0"),
    String(now.getUTCHours() + 3).padStart(2, "0"),
    String(now.getUTCMinutes()).padStart(2, "0"),
    String(now.getUTCSeconds()).padStart(2, "0"),
  ];
  return parts.join("");
}

function getPassword(timestamp: string) {
  const shortcode = requiredEnv("MPESA_SHORTCODE");
  const passkey = requiredEnv("MPESA_PASSKEY");
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
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

  if (!response.ok) {
    throw new Error(`M-Pesa token request failed with HTTP ${response.status}.`);
  }

  const data = (await response.json()) as MpesaTokenResponse;
  if (!data.access_token) throw new Error("M-Pesa did not return an access token.");

  return data.access_token;
}

export async function initiateMpesaStkPush(input: {
  amount: number;
  phone: string;
  accountReference: string;
  transactionDesc: string;
}) {
  const token = await getMpesaAccessToken();
  const timestamp = getTimestamp();

  const response = await fetch(
    `${getBaseUrl()}/mpesa/stkpush/v1/processrequest`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: requiredEnv("MPESA_SHORTCODE"),
        Password: getPassword(timestamp),
        Timestamp: timestamp,
        TransactionType:
          process.env.MPESA_TRANSACTION_TYPE || "CustomerPayBillOnline",
        Amount: Math.round(input.amount),
        PartyA: input.phone,
        PartyB: requiredEnv("MPESA_SHORTCODE"),
        PhoneNumber: input.phone,
        CallBackURL: requiredEnv("MPESA_CALLBACK_URL"),
        AccountReference: input.accountReference,
        TransactionDesc: input.transactionDesc,
      }),
      cache: "no-store",
    },
  );

  const data = (await response.json()) as MpesaStkResponse & Record<string, unknown>;

  if (!response.ok) {
    throw new Error(
      `M-Pesa STK request failed with HTTP ${response.status}.`,
    );
  }

  return data;
}
