import * as React from "react";
import { Layout } from "../../components/organisms/Layout/index.js";
import { Container } from "../../components/organisms/Container/Container.js";
import { Heading } from "../../components/molecules/Heading/index.js";
import { Text } from "../../components/molecules/Text/index.js";
import { Button } from "../../components/molecules/Button/index.js";
import { Image } from "../../components/molecules/Image/index.js";
import { getNonsense } from "../../atoms/nonsense.js";
import PortfolioHeader from "./PortfolioHeader.js";
import PortfolioFooter from "./PortfolioFooter.js";
import "./portfolio.css";

export interface PortfolioAboutProps {
  onNavigate?: (page: string) => void;
}

export function PortfolioAbout({ onNavigate }: PortfolioAboutProps) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="portfolio-site">
      <PortfolioHeader onNavigate={handleNavigate} />
      
      <Layout>
        <Container padding="lg">
          <div className="portfolio-section-title">
            <Heading level={1}>About</Heading>
          </div>

          {/* Section 1: Image Left, Text Right */}
          <div className="portfolio-about__section portfolio-about__section--image-left">
            <Image
              src={getNonsense('abstractImage') as string}
              alt="About illustration"
              aspectRatio="4/3"
              rounded="md"
              className="portfolio-about__image"
            />
            <div className="portfolio-about__text">
              <Heading level={2}>{getNonsense('shortTitle')}</Heading>
              <Text>{getNonsense('longParagraph')}</Text>
            </div>
          </div>

          {/* Section 2: Text Left, Image Right */}
          <div className="portfolio-about__section portfolio-about__section--image-right">
            <Image
              src={getNonsense('abstractImage') as string}
              alt="About illustration"
              aspectRatio="4/3"
              rounded="md"
              className="portfolio-about__image"
            />
            <div className="portfolio-about__text">
              <Heading level={2}>{getNonsense('shortTitle')}</Heading>
              <Text>{getNonsense('shortParagraph')}</Text>
            </div>
          </div>

          {/* Section 3: Image Only */}
          <div className="portfolio-about__section">
            <Image
              src={getNonsense('abstractImage') as string}
              alt="Visual break"
              aspectRatio="21/9"
              rounded="md"
            />
          </div>

          {/* Section 4: Text Only */}
          <div className="portfolio-about__section">
            <div className="portfolio-about__text">
              <Heading level={2}>{getNonsense('shortTitle')}</Heading>
              <Text>{getNonsense('longParagraph')}</Text>
            </div>
          </div>

          {/* Section 5: Image Left, Text Right (Repeated Pattern) */}
          <div className="portfolio-about__section portfolio-about__section--image-left">
            <Image
              src={getNonsense('abstractImage') as string}
              alt="About illustration"
              aspectRatio="4/3"
              rounded="md"
              className="portfolio-about__image"
            />
            <div className="portfolio-about__text">
              <Heading level={2}>{getNonsense('shortTitle')}</Heading>
              <Text>{getNonsense('longParagraph')}</Text>
            </div>
          </div>

          {/* Centered CTA */}
          <div className="portfolio-about__cta">
            <div className="portfolio-about__cta-text">
              <Text>{getNonsense('shortParagraph')}</Text>
            </div>
            <Button onClick={() => handleNavigate("contact")}>
              {getNonsense('ctaText')}
            </Button>
          </div>
        </Container>
      </Layout>

      <PortfolioFooter onNavigate={handleNavigate} />
    </div>
  );
}

export default PortfolioAbout;
