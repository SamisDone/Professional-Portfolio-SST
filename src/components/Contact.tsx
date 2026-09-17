import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircleIcon, WarningCircleIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { profile } from "../data/content";
import Reveal from "./Reveal";
import MaskText from "./MaskText";

// FormSubmit needs no signup and no API key. It forwards whatever hits this
// endpoint to profile.email. The very first message sent to a given address
// triggers a one-time confirmation mail; after that link is clicked, every
// later message arrives normally.
const ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`;

const SOCIALS = [
  { label: "GitHub", href: profile.github, handle: profile.githubHandle },
  { label: "LinkedIn", href: profile.linkedin, handle: "Samonwita Sarker" },
  { label: "Codeforces", href: profile.codeforces, handle: profile.codeforcesHandle },
];

type Status = "idle" | "sending" | "sent" | "error";
type Errors = { name?: string; email?: string; message?: string };

function validate(f: { name: string; email: string; message: string }): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Please enter your name.";
  if (!f.email.trim()) e.email = "Please enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = "That does not look like a valid email.";
  if (!f.message.trim()) e.message = "Please write a message.";
  return e;
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [touched, setTouched] = useState(false);

  // Derived during render rather than pushed into state from an effect.
  const errors: Errors = touched ? validate(form) : {};

  useEffect(() => {
    if (status !== "sent") return;
    const id = window.setTimeout(() => setStatus("idle"), 8000);
    return () => window.clearTimeout(id);
  }, [status]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (Object.keys(validate(form)).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, _subject: `Portfolio message from ${form.name}` }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTouched(false);
    } catch {
      setStatus("error");
    }
  };

  const field = (k: keyof Errors) =>
    `w-full border bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:border-ink transition-colors ${
      errors[k] ? "border-accent" : "border-rule"
    }`;

  return (
    <section id="contact" className="scroll-mt-16">
      <div className="mx-auto max-w-shell section-pad px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <h1 className="max-w-[14ch] h-section font-display text-ink">
                <MaskText text="Get in touch." />
              </h1>
              <p className="mt-5 max-w-measure text-[17px] leading-relaxed text-muted">
                I am looking for job opportunities in software engineering and ML. If
                you are hiring, or have a project, a paper idea, or a question about
                anything above, write to me.
              </p>
              {/* The what, how and where, above the fold. Those are the first
                  things a recruiter filters on. */}
              <dl className="mt-6 grid grid-cols-[7.75rem_1fr] gap-x-4 gap-y-2 border-l-2 border-accent pl-4 text-[15px] leading-snug">
                {[
                  ["Looking for", profile.status],
                  ["Work", profile.workMode],
                  ["Based", `${profile.location} (UTC+6)`],
                ].map(([term, value]) => (
                  <div key={term} className="contents">
                    <dt className="pt-0.5 font-mono text-[12px] uppercase tracking-[0.16em] text-muted">
                      {term}
                    </dt>
                    <dd className="text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href={`mailto:${profile.email}`}
                  className="tap inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent-2"
                >
                  {profile.email}
                </a>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-rule px-4 py-2 text-[14px] font-medium text-ink transition-colors hover:border-accent"
                >
                  Download the CV
                  <ArrowUpRightIcon size={13} weight="bold" />
                </a>
              </div>
            </Reveal>

            <Reveal index={1}>
              <dl className="mt-12 flex flex-col">
                {SOCIALS.map((s) => (
                  <div key={s.label} className="border-t border-rule py-3.5">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tap group flex items-center justify-between gap-4"
                    >
                      <dt className="font-mono text-[12px] text-muted">{s.label}</dt>
                      <dd className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
                        {s.handle}
                        <ArrowUpRightIcon
                          size={13}
                          className="transition-transform group-hover:-translate-y-0.5"
                        />
                      </dd>
                    </a>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal index={1} className="lg:col-span-7">
            <form onSubmit={submit} noValidate className="flex flex-col gap-5">
              <AnimatePresence>
                {status === "sent" && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    role="status"
                    className="flex items-center gap-2.5 border border-rule bg-raised px-4 py-3.5 text-[15px] text-ink"
                  >
                    <CheckCircleIcon size={18} weight="fill" className="text-accent" />
                    Message sent. I will get back to you.
                  </motion.p>
                )}
                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    role="alert"
                    className="flex items-center gap-2.5 border border-accent bg-raised px-4 py-3.5 text-[15px] text-ink"
                  >
                    <WarningCircleIcon size={18} weight="fill" className="text-accent" />
                    That did not send. Please email me directly instead.
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="c-name"
                    className="mb-2 block font-mono text-[12px] uppercase tracking-[0.16em] text-muted"
                  >
                    Name
                  </label>
                  <input
                    id="c-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "c-name-err" : undefined}
                    className={field("name")}
                  />
                  {errors.name && (
                    <p id="c-name-err" role="alert" className="mt-2 text-[13px] text-accent">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="c-email"
                    className="mb-2 block font-mono text-[12px] uppercase tracking-[0.16em] text-muted"
                  >
                    Email
                  </label>
                  <input
                    id="c-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "c-email-err" : undefined}
                    className={field("email")}
                  />
                  {errors.email && (
                    <p id="c-email-err" role="alert" className="mt-2 text-[13px] text-accent">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="c-message"
                  className="mb-2 block font-mono text-[12px] uppercase tracking-[0.16em] text-muted"
                >
                  Message
                </label>
                <textarea
                  id="c-message"
                  name="message"
                  rows={6}
                  placeholder="The role, the project, or the question."
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "c-message-err" : undefined}
                  className={`${field("message")} resize-none`}
                />
                {errors.message && (
                  <p id="c-message-err" role="alert" className="mt-2 text-[13px] text-accent">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="self-start bg-accent-solid px-7 py-3.5 text-sm font-medium text-on-accent transition-transform hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {status === "sending" ? "Sending" : "Send message"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>

    </section>
  );
}
