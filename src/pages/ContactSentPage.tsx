import Page from "../components/Page";
import { Button, TextLink } from "../components/ui";
import { profile } from "../data/content";
import DecodeText from "../components/DecodeText";

/**
 * Where the contact form lands when JavaScript is off: the browser posts the
 * form to Static Forms, which sends it back here (the form's `redirectTo`).
 * With JavaScript on, the form shows its own confirmation and never comes
 * here. Kept out of search and the sitemap.
 */
export default function ContactSentPage() {
  return (
    <Page title="Message sent">
      <section className="shell tier-a">
        <DecodeText tabIndex={-1} className="t-h1 band">
          Message sent.
        </DecodeText>
        <p className="t-lead mt-6 max-w-[48ch]">
          Thank you. Your message is on its way to my inbox, and I will reply to the address you gave.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button to="/work" variant="primary">
            See the work
          </Button>
          <Button href={profile.resumeUrl}>CV (PDF)</Button>
        </div>
        <p className="t-small mt-8">
          <TextLink to="/contact" arrow="left">
            Back to the contact page
          </TextLink>
        </p>
      </section>
    </Page>
  );
}
