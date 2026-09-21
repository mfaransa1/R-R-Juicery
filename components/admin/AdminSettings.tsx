"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  CreditCard,
  Globe,
  MapPin,
  Save,
  Store,
} from "lucide-react";

type SettingsSection =
  | "business"
  | "orders"
  | "payments"
  | "notifications";

export default function AdminSettings() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("business");

  const [saved, setSaved] = useState(false);

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="border-b border-black/10 pb-8">
        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-black/35">
          OPERATIONS / CONFIGURATION
        </p>

        <h1 className="mt-3 font-serif text-5xl tracking-[-0.045em]">
          Settings.
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/45">
          Manage the information and configuration used across
          the R&R platform.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[230px_1fr]">
        <nav className="lg:border-r lg:border-black/10 lg:pr-8">
          {[
            {
              id: "business" as const,
              label: "Business",
              icon: Store,
            },
            {
              id: "orders" as const,
              label: "Orders",
              icon: Globe,
            },
            {
              id: "payments" as const,
              label: "Payments",
              icon: CreditCard,
            },
            {
              id: "notifications" as const,
              label: "Notifications",
              icon: Bell,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`flex w-full items-center gap-3 border-b border-black/5 px-3 py-4 text-left text-xs transition lg:border-0 ${
                  activeSection === item.id
                    ? "bg-black text-white"
                    : "text-black/45 hover:bg-black/5 hover:text-black"
                }`}
              >
                <Icon size={16} strokeWidth={1.35} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="max-w-4xl">
          {activeSection === "business" && (
            <BusinessSettings
              onSave={handleSave}
              saved={saved}
            />
          )}

          {activeSection === "orders" && (
            <OrderSettings
              onSave={handleSave}
              saved={saved}
            />
          )}

          {activeSection === "payments" && (
            <PaymentSettings
              onSave={handleSave}
              saved={saved}
            />
          )}

          {activeSection === "notifications" && (
            <NotificationSettings
              onSave={handleSave}
              saved={saved}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-black/10 pb-7">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/35">
        {eyebrow}
      </p>

      <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em]">
        {title}
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/45">
        {description}
      </p>
    </div>
  );
}

function SaveButton({ saved }: { saved: boolean }) {
  return (
    <button
      type="submit"
      className="flex items-center gap-3 bg-black px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#292929]"
    >
      {saved ? (
        <>
          <Check size={15} strokeWidth={1.4} />
          Saved
        </>
      ) : (
        <>
          <Save size={15} strokeWidth={1.4} />
          Save changes
        </>
      )}
    </button>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.17em] text-black/35">
        {label}
      </span>

      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-13 w-full border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}

function BusinessSettings({
  onSave,
  saved,
}: {
  onSave: (event: React.FormEvent<HTMLFormElement>) => void;
  saved: boolean;
}) {
  return (
    <form onSubmit={onSave}>
      <SettingsHeader
        eyebrow="BUSINESS / IDENTITY"
        title="Business details"
        description="The core information used across the website, customer communications and operational interfaces."
      />

      <div className="mt-8 space-y-8">
        <section className="border border-black/10 bg-white p-6 sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <Store size={18} strokeWidth={1.3} />

            <h3 className="font-serif text-2xl">
              Rook & Reed Juicery
            </h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Business name"
              name="businessName"
              defaultValue="The Rook & Reed Juicery"
            />

            <Field
              label="Phone / WhatsApp"
              name="phone"
              defaultValue="0758 038 852"
            />

            <Field
              label="Email"
              name="email"
              type="email"
              defaultValue="rookreedjuicery@gmail.com"
            />

            <Field
              label="Instagram"
              name="instagram"
              defaultValue="@rookandreedjuicery"
            />

            <div className="sm:col-span-2">
              <Field
                label="Location"
                name="location"
                defaultValue="Rook & Reed Plaza, Kilimani, Nairobi"
              />
            </div>
          </div>
        </section>

        <section className="border border-black/10 bg-white p-6 sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <MapPin size={18} strokeWidth={1.3} />

            <h3 className="font-serif text-2xl">
              Opening hours
            </h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Opening time"
              name="openingTime"
              type="time"
              defaultValue="08:00"
            />

            <Field
              label="Closing time"
              name="closingTime"
              type="time"
              defaultValue="20:00"
            />
          </div>

          <p className="mt-6 text-[10px] leading-relaxed text-black/35">
            Current R&R operating hours are 8:00 AM–8:00 PM
            daily.
          </p>
        </section>

        <div className="flex justify-end">
          <SaveButton saved={saved} />
        </div>
      </div>
    </form>
  );
}

function OrderSettings({
  onSave,
  saved,
}: {
  onSave: (event: React.FormEvent<HTMLFormElement>) => void;
  saved: boolean;
}) {
  return (
    <form onSubmit={onSave}>
      <SettingsHeader
        eyebrow="COMMERCE / ORDERS"
        title="Order settings"
        description="Control the basic fulfilment rules used by the R&R ordering experience."
      />

      <div className="mt-8 space-y-6">
        <section className="border border-black/10 bg-white p-6 sm:p-8">
          <h3 className="font-serif text-2xl">
            Fulfilment
          </h3>

          <div className="mt-7 space-y-5">
            <ToggleRow
              label="Pickup"
              description="Allow customers to collect orders from R&R."
              defaultChecked
            />

            <ToggleRow
              label="Delivery"
              description="Allow customers to request delivery."
              defaultChecked
            />
          </div>
        </section>

        <section className="border border-black/10 bg-white p-6 sm:p-8">
          <h3 className="font-serif text-2xl">
            Delivery threshold
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-black/45">
            Current working rule: free delivery above KSh
            2,000 within the applicable service area.
          </p>

          <div className="mt-7 max-w-sm">
            <Field
              label="Free delivery threshold"
              name="freeDeliveryThreshold"
              type="number"
              defaultValue="2000"
            />
          </div>

          <p className="mt-5 text-[10px] leading-relaxed text-black/35">
            Exact delivery zones and lower-order distance tiers
            should be confirmed before being presented as final
            customer-facing rules.
          </p>
        </section>

        <div className="flex justify-end">
          <SaveButton saved={saved} />
        </div>
      </div>
    </form>
  );
}

function PaymentSettings({
  onSave,
  saved,
}: {
  onSave: (event: React.FormEvent<HTMLFormElement>) => void;
  saved: boolean;
}) {
  return (
    <form onSubmit={onSave}>
      <SettingsHeader
        eyebrow="COMMERCE / PAYMENTS"
        title="Payment methods"
        description="Configure the payment methods available to customers."
      />

      <div className="mt-8 border border-black/10 bg-white p-6 sm:p-8">
        <div className="space-y-5">
          <ToggleRow
            label="M-PESA"
            description="Mobile money payment."
            defaultChecked
          />

          <ToggleRow
            label="PDQ / CARD"
            description="Card payment at the point of sale."
            defaultChecked
          />

          <ToggleRow
            label="CASH"
            description="Cash payment."
            defaultChecked
          />
        </div>

        <div className="mt-8 border-t border-black/10 pt-7">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/35">
            INTEGRATION STATUS
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <StatusBox
              title="M-PESA"
              status="BACKEND REQUIRED"
            />

            <StatusBox
              title="CARD"
              status="BACKEND REQUIRED"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <SaveButton saved={saved} />
      </div>
    </form>
  );
}

function NotificationSettings({
  onSave,
  saved,
}: {
  onSave: (event: React.FormEvent<HTMLFormElement>) => void;
  saved: boolean;
}) {
  return (
    <form onSubmit={onSave}>
      <SettingsHeader
        eyebrow="SYSTEM / COMMUNICATION"
        title="Notifications"
        description="Choose which operational notifications should eventually be connected to email or other messaging services."
      />

      <div className="mt-8 border border-black/10 bg-white p-6 sm:p-8">
        <div className="space-y-5">
          <ToggleRow
            label="New order"
            description="Notify the team when a new order is received."
            defaultChecked
          />

          <ToggleRow
            label="Order ready"
            description="Notify customers when pickup orders are ready."
            defaultChecked
          />

          <ToggleRow
            label="Delivery update"
            description="Send delivery status updates."
            defaultChecked
          />

          <ToggleRow
            label="New contact message"
            description="Notify the team when a customer submits the contact form."
            defaultChecked
          />
        </div>

        <div className="mt-8 border-t border-black/10 pt-7">
          <Field
            label="Operations email"
            name="operationsEmail"
            type="email"
            defaultValue="rookreedjuicery@gmail.com"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <SaveButton saved={saved} />
      </div>
    </form>
  );
}

function ToggleRow({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-6 border-b border-black/5 pb-5 last:border-0 last:pb-0">
      <div>
        <p className="text-sm font-medium">{label}</p>

        <p className="mt-1 max-w-xl text-xs leading-relaxed text-black/40">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-5 w-5 shrink-0 accent-black"
      />
    </label>
  );
}

function StatusBox({
  title,
  status,
}: {
  title: string;
  status: string;
}) {
  return (
    <div className="border border-black/10 p-4">
      <p className="text-xs font-medium">{title}</p>

      <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-black/35">
        {status}
      </p>
    </div>
  );
}