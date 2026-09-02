import { usePortfolio } from "../../../hooks/usePortfolio";
import { useT } from "../../../i18n/useTranslation";
import { SectionHeader } from "../../common/SectionHeader";
import { Reveal } from "../../common/Reveal";
import { PolaroidPile } from "./PolaroidPile";
import { ContactChannels } from "./ContactChannels";
import { ContactForm } from "./ContactForm";

export function Contact() {
  const { content } = usePortfolio();
  const t = useT();

  return (
    <section id="contact">
      <div className="container">
        <SectionHeader tag={t(content["section.contact.tag"])} title={t(content["section.contact.title"])} />

        <Reveal className="contact-layout">
          <div className="contact-visual">
            <PolaroidPile />
            <ContactChannels />
          </div>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
