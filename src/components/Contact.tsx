import { useEffect, useRef, useState, type FormEvent } from "react";
import { profile } from "../data/content";
import { absolute } from "../lib/site";
import { Button, Label, TextLink } from "./ui";

// FormSubmit needs no signup and no API key. It forwards whatever is posted
// to profile.email. The very first message sent to a given address triggers
// a one-time confirmation mail; until that link is clicked, nothing arrives.
//
// Two ways in. With JavaScript, the form posts to the AJAX endpoint and shows
// its own confirmation. Without it, the browser posts the form itself to the
// plain endpoint, and FormSubmit sends it back to /contact/sent (`_next`).
const ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`;
const NATIVE_ENDPOINT = `https://formsubmit.co/${profile.email}`;
const SUBJECT = "Portfolio message";

const SOCIALS = [
  { label: "GitHub", href: profile.github, handle: profile.githubHandle },
  { label: "LinkedIn", href: profile.linkedin, handle: "Samonwita Sarker" },
  { label: "Codeforces", href: profile.codeforces, handle: profile.codeforcesHandle },
];

type Status = "idle" | "sending" | "sent" | "error";
type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "enter your name.";
  if (!f.email.trim()) e.email = "enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "that does not look like a valid email.";
  if (!f.message.trim()) e.message = "write a message.";
  return e;
}

/**
 * An error never relies on colour: it sits on a yellow block under the field,
 * and it starts with "Check this:".
 */
function FieldError({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="t-small mt-2 border-2 border-ink bg-proof px-3 py-2">
      <strong className="font-semibold">Check this:</strong> {children}
    </p>
  );
}

export default function Contact() {
  const [form, setForm] = useState<Fields>({ name: "", email: "", message: "" });
  // The honeypot. People never see it; a bot that fills every field does.
  const [honey, setHoney] = useState("");
  // Native validation guards the form while there is no script; once the
  // script runs it takes over with its own messages.
  const formRef = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true;
  }, []);
  const [status, setStatus] = useState<Status>("idle");
  const [touched, setTouched] = useState(false);
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
    // A filled honeypot is a bot. It is told the message went, and nothing is
    // sent, so it learns nothing about the trap.
    if (honey) {
      setStatus("sent");
      return;
    }
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, _subject: `${SUBJECT} from ${form.name}`, _honey: honey }),
      });
      if (!res.ok) throw new Error(String(res.status));
      // FormSubmit answers 200 with success "false" when it refuses a message,
      // for example before the address has been activated.
      const body = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (body.success === "false" || body.success === false) throw new Error("refused");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTouched(false);
    } catch {
      setStatus("error");
    }
  };

  const field = (k: keyof Fields, type = "text", autoComplete?: string, placeholder?: string) => (
    <div>
      <label htmlFor={`c-${k}`} className="t-label mb-2 block text-ink">
        {k === "name" ? "Name" : k === "email" ? "Email" : "Message"}
      </label>
      {k === "message" ? (
        <textarea
          id="c-message"
          name="message"
          rows={6}
          placeholder={placeholder}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "c-message-err" : undefined}
          className="field t-body block w-full resize-y py-3"
        />
      ) : (
        <input
          id={`c-${k}`}
          name={k}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={form[k]}
          onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
          required
          aria-invalid={!!errors[k]}
          aria-describedby={errors[k] ? `c-${k}-err` : undefined}
          className="field t-body block h-12 w-full"
        />
      )}
      <FieldError id={`c-${k}-err`}>{errors[k]}</FieldError>
    </div>
  );

  return (
    <div className="shell tier-a grid gap-12 lg:grid-cols-12 lg:gap-8">
      <section className="lg:col-span-5">
        <h1 tabIndex={-1} className="t-h1 band max-w-[14ch]">
          Get in touch.
        </h1>
        <p className="t-lead mt-6 max-w-measure">
          I am looking for job opportunities in software engineering and ML. If you are hiring, or have a
          project, a paper idea, or a question about anything here, write to me.
        </p>

        <dl className="m-0 mt-8 flex flex-col gap-4 border-t-2 border-ink pt-6">
          {[
            ["Looking for", profile.status],
            ["Work", profile.workMode],
            ["Based", `${profile.location} (UTC+6)`],
          ].map(([term, value]) => (
            <div key={term}>
              <Label as="dt">{term}</Label>
              <dd className="t-body m-0 mt-1">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a href={`mailto:${profile.email}`} className="link tap t-body font-semibold">
            {profile.email}
          </a>
          <Button href={profile.resumeUrl}>Download the CV</Button>
        </div>

        <ul className="m-0 mt-12 list-none p-0">
          {SOCIALS.map((s) => (
            <li key={s.label} className="tint-row flex items-baseline justify-between gap-4 border-t border-ink py-3 last:border-b">
              <Label as="span">{s.label}</Label>
              <TextLink href={s.href} className="t-small font-semibold">
                {s.handle}
              </TextLink>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Contact form" className="lg:col-span-7">
        <form
          action={NATIVE_ENDPOINT}
          method="POST"
          onSubmit={submit}
          ref={formRef}
          className="flex flex-col gap-6"
        >
          {/* For the post the browser makes with JavaScript off. */}
          <input type="hidden" name="_subject" value={SUBJECT} />
          <input type="hidden" name="_next" value={absolute("/contact/sent")} />
          <input type="hidden" name="_captcha" value="false" />
          {/* The honeypot: off screen, out of the tab order, hidden from
              screen readers. FormSubmit drops any submission that fills it. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="c-honey">Leave this empty</label>
            <input
              id="c-honey"
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              value={honey}
              onChange={(e) => setHoney(e.target.value)}
            />
          </div>
          {status === "sent" && (
            <p role="status" className="t-body border-2 border-ink bg-paper-2 px-4 py-3">
              Message sent. I will get back to you.
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="t-body border-2 border-ink bg-proof px-4 py-3">
              <strong className="font-semibold">Check this:</strong> that did not send. Please email me directly
              instead.
            </p>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {field("name", "text", "name", "Your name")}
            {field("email", "email", "email", "you@company.com")}
          </div>
          {field("message", "text", undefined, "The role, the project, or the question.")}

          <div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn btn-primary press"
            >
              {status === "sending" ? "Sending" : "Send message"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
