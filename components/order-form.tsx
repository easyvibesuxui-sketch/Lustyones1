"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { site } from "@/lib/site";
import { primaryButton } from "@/lib/ui";
import { ArrowIcon, CheckIcon } from "./icons";

type Option = { id: string; name: string; note?: string };
type Props = { t: Dictionary["order"]["form"]; templates: Option[]; plans: Option[]; initial?: { template?: string | null; plan?: string | null } };
type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-(--radius-control) border border-line bg-surface/60 px-4 py-3.5 font-body text-base text-heading placeholder:text-muted/70 transition focus:border-accent focus:outline-none";
const label = "font-heading text-xs uppercase tracking-[0.25em] text-muted";

// A row of choices drawn as cards; picking one sets `value`.
function Choices({ name, options, value, onChange }: { name: string; options: Option[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      {options.map((o) => (
        <label
          key={o.id}
          className="group relative flex cursor-pointer flex-col gap-1 rounded-(--radius-control) border border-line px-4 py-3.5 transition hover:border-heading/60 has-[:checked]:border-accent has-[:checked]:bg-accent/10"
        >
          <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} className="sr-only" />
          <span className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-heading">{o.name}</span>
          {o.note && <span className="font-body text-xs text-muted">{o.note}</span>}
          <CheckIcon className="absolute right-3 top-3.5 text-accent opacity-0 transition group-has-[:checked]:opacity-100" />
        </label>
      ))}
    </div>
  );
}

function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-line pt-8">
      <legend className={`${label} float-left w-full`}>{legend}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

// The order form preset from the page's ?template= and ?plan=. It reads the query in the browser,
// so on the order page it sits in a <Suspense> whose fallback is the plain form.
export function OrderFormFromQuery(props: Props) {
  const q = useSearchParams();
  return <OrderForm {...props} initial={{ template: q.get("template"), plan: q.get("plan") }} />;
}

// The brief on the order page.
export function OrderForm({ t, templates, plans, initial }: Props) {
  const known = (list: Option[], id?: string | null) => (id && list.some((o) => o.id === id) ? id : undefined);
  const [template, setTemplate] = useState(known(templates, initial?.template) ?? "unsure");
  const [plan, setPlan] = useState(known(plans, initial?.plan) ?? plans[0]?.id ?? "");
  const [via, setVia] = useState<"email" | "telegram">("email");
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);

  const nameOf = (list: Option[], id: string) => list.find((o) => o.id === id)?.name ?? id;

  // The brief as plain text, for the email body or to paste into Telegram.
  const brief = (form: HTMLFormElement) => {
    const d = new FormData(form);
    return [
      `${t.template}: ${nameOf(templates, template)}`,
      `${t.plan}: ${nameOf(plans, plan)}`,
      `${t.name}: ${d.get("name")}`,
      `${via === "email" ? t.email : t.telegram}: ${d.get("contact")}`,
      `${t.domain}: ${d.get("domain") || "-"}`,
      "",
      String(d.get("message") || ""),
    ].join("\n");
  };
  const subject = () => `${site.name}: ${nameOf(templates, template)} / ${nameOf(plans, plan)}`;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = brief(e.currentTarget);
    if (!site.web3formsKey) {
      location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject())}&body=${encodeURIComponent(text)}`;
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: site.web3formsKey, subject: subject(), from_name: site.name, message: text }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const copy = async (e: MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.form;
    if (!form?.reportValidity()) return;
    await navigator.clipboard.writeText(brief(form));
    setCopied(true);
  };

  if (status === "sent") {
    return (
      <div className="border-t border-accent pt-10">
        <CheckIcon className="size-8 text-accent" />
        <p className="mt-6 font-heading text-3xl font-bold uppercase text-heading">{t.sentTitle}</p>
        <p className="mt-4 max-w-md font-body text-base leading-relaxed text-ink/90">{t.sent}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-12">
      <Fieldset legend={t.template}>
        <Choices name="template" options={[...templates, { id: "unsure", name: t.notSure }]} value={template} onChange={setTemplate} />
      </Fieldset>

      <Fieldset legend={t.plan}>
        <Choices name="plan" options={plans} value={plan} onChange={setPlan} />
      </Fieldset>

      <div className="grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
        <label className="flex flex-col gap-3">
          <span className={label}>{t.name}</span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <div className="flex flex-col gap-3">
          <span className={label} id="via">
            {t.contactBy}
          </span>
          <div className="flex" role="radiogroup" aria-labelledby="via">
            {(["email", "telegram"] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={via === v}
                onClick={() => setVia(v)}
                className="flex-1 border border-line px-3 py-2 font-heading text-xs uppercase tracking-[0.2em] text-muted transition first:rounded-l-(--radius-control) last:rounded-r-(--radius-control) aria-checked:border-accent aria-checked:bg-accent aria-checked:text-night"
              >
                {v === "email" ? t.email : t.telegram}
              </button>
            ))}
          </div>
          <input
            key={via}
            name="contact"
            required
            type={via === "email" ? "email" : "text"}
            autoComplete={via === "email" ? "email" : "off"}
            placeholder={via === "email" ? t.emailPlaceholder : t.telegramPlaceholder}
            aria-labelledby="via"
            className={field}
          />
        </div>
        <label className="flex flex-col gap-3 sm:col-span-2">
          <span className={label}>{t.domain}</span>
          <input name="domain" placeholder={t.domainPlaceholder} className={field} />
        </label>
        <label className="flex flex-col gap-3 sm:col-span-2">
          <span className={label}>{t.message}</span>
          <textarea name="message" rows={5} placeholder={t.messagePlaceholder} className={`${field} resize-y`} />
        </label>
      </div>

      <label className="flex cursor-pointer items-start gap-4 border-t border-line pt-8 font-body text-sm leading-relaxed text-ink/90">
        <input type="checkbox" required className="mt-1 size-4 shrink-0 accent-(--color-accent)" />
        {t.consent}
      </label>

      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
        <button type="submit" disabled={status === "sending"} className={`group ${primaryButton} disabled:opacity-60`}>
          {status === "sending" ? t.sending : t.submit}
          <ArrowIcon className="transition-transform group-hover:translate-x-1" />
        </button>
        <button
          type="button"
          onClick={copy}
          className="border-b border-heading/50 pb-1 font-heading text-xs uppercase tracking-[0.2em] text-heading transition hover:border-accent hover:text-accent-soft"
        >
          {copied ? t.copied : t.copy}
        </button>
      </div>
      {!site.web3formsKey && <p className="-mt-6 font-body text-xs text-muted">{t.mailNote}</p>}
      {status === "error" && (
        <p role="alert" className="-mt-6 font-body text-sm text-accent-soft">
          {t.error}
        </p>
      )}
    </form>
  );
}
