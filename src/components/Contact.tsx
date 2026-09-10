import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import HlsBackgroundVideo from "./HlsBackgroundVideo";
import { profile } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";

// FormSubmit.co needs no signup or API key — it just emails whatever hits
// this endpoint to profile.email. The very first submission ever sent to a
// given address triggers a one-time confirmation email from FormSubmit; once
// that link is clicked, every message after arrives normally.
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`;

const SOCIALS = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Codeforces", href: profile.codeforces },
];

type Status = "idle" | "sending" | "sent" | "error";

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

function validateForm(form: { name: string; email: string; message: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = "Please enter your name.";
  if (!form.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "That doesn't look like a valid email.";
  }
  if (!form.message.trim()) errors.message = "Please write a message.";
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.2 }}
          id={id}
          role="alert"
          className="text-xs text-red-400 mt-1.5 pl-1"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export default function Contact() {
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState(false);
  const reduced = useReducedMotion();

  // Validation is derived during render once the form has been submitted
  // once, rather than pushed into state from an effect.
  const errors: FieldErrors = touched ? validateForm(form) : {};

  useEffect(() => {
    if (!marqueeRef.current || reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, [reduced]);

  // Auto-dismiss success banner after 8 seconds
  useEffect(() => {
    if (status !== "sent") return;
    const id = window.setTimeout(() => setStatus("idle"), 8000);
    return () => window.clearTimeout(id);
  }, [status]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const fieldErrors = validateForm(form);
    setTouched(true);

    if (Object.keys(fieldErrors).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `Portfolio message from ${form.name}`,
        }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTouched(false);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const inputCls = (field: keyof FieldErrors) =>
    `w-full bg-bg/60 border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-muted focus:outline-none transition-colors ${
      errors[field]
        ? "border-red-400/60 focus:border-red-400"
        : "border-stroke focus:border-text-primary/40"
    }`;

  return (
    <section
      id="contact"
      className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 scale-y-[-1]">
          <HlsBackgroundVideo posterOnly />
        </div>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10">
        <div className="overflow-hidden py-8 md:py-12 select-none">
          <div ref={marqueeRef} className="flex whitespace-nowrap w-fit">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="text-5xl md:text-7xl font-display italic text-text-primary/20 pr-8"
              >
                CODE · RESEARCH · REPEAT •{" "}
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-stroke" />
                <span className="text-xs text-muted uppercase tracking-[0.3em]">
                  Get In Touch
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display leading-[1.05] text-text-primary mb-4">
                Let's build <span className="italic">something</span>
              </h2>
              <p className="text-sm md:text-base text-muted max-w-sm mb-8">
                Have a project, a research idea, or just want to say hi? Send
                a message and it'll land straight in my inbox.
              </p>

              <a
                href={`mailto:${profile.email}`}
                className="group relative inline-flex rounded-full"
              >
                <span
                  className="absolute -inset-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)",
                  }}
                />
                <span className="relative z-10 flex items-center gap-2 rounded-full border-2 border-stroke group-hover:border-bg bg-bg px-6 py-3 text-sm text-text-primary transition-colors duration-300">
                  {profile.email} <span aria-hidden>↗</span>
                </span>
              </a>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4 bg-surface/40 backdrop-blur-md border border-stroke rounded-3xl p-6 md:p-8"
            >
              {/* Success banner */}
              <AnimatePresence>
                {status === "sent" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-emerald-400">
                        <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm text-emerald-300 font-medium">Message sent!</p>
                      <p className="text-xs text-emerald-400/70 mt-0.5">
                        Thanks — I'll get back to you soon.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error banner */}
              <AnimatePresence>
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 px-5 py-4"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-red-400">
                        <path d="M8 4.5V8.5M8 11V11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm text-red-300 font-medium">Something went wrong</p>
                      <p className="text-xs text-red-400/70 mt-0.5">
                        Please try again, or email{" "}
                        <a href={`mailto:${profile.email}`} className="underline hover:text-red-300 transition-colors">
                          directly
                        </a>
                        .
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label
                  htmlFor="contact-name"
                  className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  className={inputCls("name")}
                />
                <FieldError id="contact-name-error" message={errors.name} />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  className={inputCls("email")}
                />
                <FieldError id="contact-email-error" message={errors.email} />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="What's on your mind?"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  className={`${inputCls("message")} resize-none`}
                />
                <FieldError id="contact-message-error" message={errors.message} />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-2 rounded-full bg-text-primary text-bg text-sm px-7 py-3.5 hover:scale-[1.02] transition-transform duration-300 disabled:opacity-60 disabled:hover:scale-100"
              >
                {status === "sending" ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-stroke/60">
            <div className="flex items-center gap-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-muted hover:text-text-primary transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs sm:text-sm text-muted">
                Available for projects
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
