import * as React from "react";
import { Layout } from "../../components/organisms/Layout/index.js";
import { Container } from "../../components/organisms/Container/Container.js";
import { Heading } from "../../components/molecules/Heading/index.js";
import { Text } from "../../components/molecules/Text/index.js";
import { Button } from "../../components/molecules/Button/index.js";
import { Link } from "../../components/molecules/Link/index.js";
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
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const socialLinks = [
    { name: getNonsense('socialSiteName'), url: '#' },
    { name: getNonsense('socialSiteName'), url: '#' },
    { name: getNonsense('socialSiteName'), url: '#' },
    { name: getNonsense('socialSiteName'), url: '#' },
    { name: getNonsense('socialSiteName'), url: '#' },
  ];

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

          <form className="portfolio-contact__form" onSubmit={handleSubmit}>
            <div className="portfolio-contact__field">
              <label htmlFor="name" className="portfolio-contact__label">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="portfolio-contact__input"
                placeholder={getNonsense('personName') as string}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="portfolio-contact__field">
              <label htmlFor="email" className="portfolio-contact__label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="portfolio-contact__input"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="portfolio-contact__field">
              <label htmlFor="subject" className="portfolio-contact__label">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                className="portfolio-contact__input"
                placeholder={getNonsense('shortTitle') as string}
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="portfolio-contact__field">
              <label htmlFor="message" className="portfolio-contact__label">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="portfolio-contact__textarea"
                placeholder={getNonsense('longParagraph') as string}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <Button>
              {getNonsense('ctaText')}
            </Button>
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
        title={getNonsense('shortTitle') as string}
      >
        <Text>{getNonsense('shortParagraph')}</Text>
        <div className="portfolio-modal__actions">
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}

export default PortfolioContact;