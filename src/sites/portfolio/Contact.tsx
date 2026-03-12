import * as React from "react";
import { Layout } from "../../components/organisms/Layout/index.js";
import { Container } from "../../components/organisms/Container/Container.js";
import { Heading } from "../../components/molecules/Heading/index.js";
import { Text } from "../../components/molecules/Text/index.js";
import { Button } from "../../components/molecules/Button/index.js";
import { Link } from "../../components/molecules/Link/index.js";
import { Input } from "../../components/molecules/Input/index.js";
import { Modal } from "../../components/organisms/Modal/index.js";
import { getNonsense } from "../../atoms/nonsense.js";
import PortfolioHeader from "./PortfolioHeader.js";
import PortfolioFooter from "./PortfolioFooter.js";
import "./portfolio.css";

export interface PortfolioContactProps {
  onNavigate?: (page: string) => void;
}

export function PortfolioContact({ onNavigate }: PortfolioContactProps) {
  const [showModal, setShowModal] = React.useState(false);
  const [values, setValues] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  function clearError(field: string) {
    setErrors(prev => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function handleField(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues(v => ({ ...v, [field]: e.target.value }));
      clearError(field);
    };
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!values.name)    next.name    = "This field is required.";
    if (!values.email) {
      next.email = "This field is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!values.subject) next.subject = "This field is required.";
    if (!values.message) next.message = "This field is required.";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setShowModal(true);
  };

  const [placeholders] = React.useState(() => ({
    name: getNonsense('personName') as string,
    subject: getNonsense('shortTitle') as string,
    message: getNonsense('longParagraph') as string,
    ctaText: getNonsense('ctaText') as string,
    modalTitle: getNonsense('shortTitle') as string,
    modalBody: getNonsense('shortParagraph') as string,
  }));

  const socialLinks = React.useMemo(() => [
    { name: getNonsense('socialSiteName'), url: '#' },
    { name: getNonsense('socialSiteName'), url: '#' },
    { name: getNonsense('socialSiteName'), url: '#' },
    { name: getNonsense('socialSiteName'), url: '#' },
    { name: getNonsense('socialSiteName'), url: '#' },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div className="portfolio-site">
      <PortfolioHeader onNavigate={handleNavigate} />

      <Layout>
        <Container padding="lg">
          <div className="portfolio-section-title">
            <Heading level={1}>Contact</Heading>
          </div>

          <div className="portfolio-contact__intro">
            <Text>{getNonsense('shortParagraph')}</Text>
          </div>

          <form className="portfolio-contact__form" onSubmit={handleSubmit} noValidate>
            <Input
              label="Name"
              name="name"
              type="text"
              placeholder={placeholders.name}
              value={values.name}
              onChange={handleField('name')}
              error={errors.name}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={values.email}
              onChange={handleField('email')}
              error={errors.email}
              required
            />

            <Input
              label="Subject"
              name="subject"
              type="text"
              placeholder={placeholders.subject}
              value={values.subject}
              onChange={handleField('subject')}
              error={errors.subject}
              required
            />

            <Input
              label="Message"
              name="message"
              multiline
              rows={5}
              placeholder={placeholders.message}
              value={values.message}
              onChange={handleField('message')}
              error={errors.message}
              required
            />

            <div className="portfolio-contact__submit">
              <Button>
                {placeholders.ctaText}
              </Button>
            </div>
          </form>

          <div className="portfolio-contact__social">
            <Heading level={2}>Connect With Me</Heading>
            <ul className="portfolio-contact__social-links">
              {socialLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.url}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Layout>

      <PortfolioFooter onNavigate={handleNavigate} />

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={placeholders.modalTitle}
      >
        <Text>{placeholders.modalBody}</Text>
        <div className="portfolio-modal__actions">
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}

export default PortfolioContact;
