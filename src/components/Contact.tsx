import { useEffect, useRef, useState, type FormEvent } from "react";
import { contactForm, profile } from "../data/content";
import { absolute } from "../lib/site";
import { Button, Label, TextLink } from "./ui";
import DecodeText from "./DecodeText";

// Static Forms (staticforms.dev) emails each submission to the account that
// owns the API key in contactForm.apiKey. The key is public by design: it
// sits in the HTML, and Static Forms rate-limits per key.
//
// Two ways in, one endpoint. With JavaScript, the form posts JSON and shows
// its own confirmation or error. Without it, the browser posts the form
// itself, and Static Forms answers with a 303 to `redirectTo`, which must be
// an absolute URL: /contact/sent. Spam is caught by the honeypot field only.
const ENDPOINT = "https://api.staticforms.dev/submit";
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
 * An error never relies on colour: it sits in a 2px ink frame on paper-2
 * under the field, and it starts with "Check this:". Not yellow: yellow is
 * kept for claims with a receipt.
 */
function FieldError({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="t-small mt-2 border-2 border-ink bg-paper-2 px-3 py-2">
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
        // No redirectTo here: that is for the browser's own post. The email
        // field becomes the reply-to address of the notification.
        body: JSON.stringify({
          apiKey: contactForm.apiKey,
          ...form,
          subject: `${SUBJECT} from ${form.name}`,
          honeypot: honey,
        }),
      });
      // Static Forms answers { success: true } with a 200, and an error
      // status with { success: false, message } when it refuses one.
      const body = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (!res.ok || body.success !== true) throw new Error(String(res.status));
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

  /*
   * The markup is in phone order: the heading, the lead, the email address and
   * the CV, then the form, then the details and the profiles, so a phone
   * reaches both ways to write before anything else. From `lg` the form takes
   * the right column from the top and the details sit under the email in the
   * left one.
   */
  return (
    <div className="shell tier-a grid lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8">
      <section aria-label="Get in touch" className="lg:col-span-5 lg:row-start-1">
        <DecodeText tabIndex={-1} className="t-h1 band max-w-[14ch]">
          Get in touch.
        </DecodeText>
        <p className="t-lead mt-6 max-w-measure">
          I am looking for job opportunities in software engineering and ML. If you are hiring, or have a
          project, a paper idea, or a question about anything here, write to me.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a href={`mailto:${profile.email}`} className="link tap t-body font-semibold">
            {profile.email}
          </a>
          <Button href={profile.resumeUrl}>Download the CV</Button>
        </div>
      </section>

      <section aria-label="Contact form" className="mt-12 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:mt-0">
        {contactForm.fallback && (
          <p className="t-body mb-6 border-2 border-ink bg-paper-2 px-4 py-3">
            {contactForm.fallbackNotice}{" "}
            <a href={`mailto:${profile.email}`} className="link tap font-semibold">
              {profile.email}
            </a>
          </p>
        )}
        <form
          action={ENDPOINT}
          method="POST"
          onSubmit={submit}
          ref={formRef}
          className="relative flex flex-col gap-6"
        >
          {/* For the post the browser makes with JavaScript off. */}
          <input type="hidden" name="apiKey" value={contactForm.apiKey} />
          <input type="hidden" name="subject" value={SUBJECT} />
          <input type="hidden" name="redirectTo" value={absolute("/contact/sent")} />
          {/* The honeypot: off screen, out of the tab order, hidden from
              screen readers. Static Forms silently drops any submission that
              fills a field whose name contains "honeypot". */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="c-honey">Leave this empty</label>
            <input
              id="c-honey"
              type="text"
              name="honeypot"
              tabIndex={-1}
              autoComplete="off"
              value={honey}
              onChange={(e) => setHoney(e.target.value)}
            />
          </div>
          {status === "sent" && (
            <>
              {/* F7: a SENT stamp lands over the form, then the line below
                  says it in words. Decoration only; the status line is what
                  a screen reader hears. */}
              <span aria-hidden className="sent-stamp">
                Sent
              </span>
              <p role="status" className="sent-note t-body border-2 border-ink bg-paper-2 px-4 py-3">
                Message sent. I will get back to you.
              </p>
            </>
          )}
          {status === "error" && (
            <p role="alert" className="t-body border-2 border-ink bg-paper-2 px-4 py-3">
              <strong className="font-semibold">Check this:</strong> that did not send. Email me directly:{" "}
              <a href={`mailto:${profile.email}`} className="link tap font-semibold">
                {profile.email}
              </a>
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

      <section aria-label="Details and profiles" className="mt-12 lg:col-span-5 lg:row-start-2 lg:mt-8">
        <dl className="m-0 flex flex-col gap-4 border-t-2 border-ink pt-6">
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
    </div>
  );
}
