import * as React from "react";
import { Layout } from "../../components/organisms/Layout/index.js";
import { Container } from "../../components/organisms/Container/Container.js";
import { Card } from "../../components/organisms/Card/index.js";
import { Heading } from "../../components/molecules/Heading/index.js";
import { Text } from "../../components/molecules/Text/index.js";
import { Button } from "../../components/molecules/Button/index.js";
import { Image } from "../../components/molecules/Image/index.js";
import { getNonsense } from "../../atoms/nonsense.js";
import PortfolioHeader from "./PortfolioHeader.js";
import PortfolioFooter from "./PortfolioFooter.js";
import "./portfolio.css";

export interface PortfolioHomeProps {
  onNavigate?: (page: string) => void;
}

export function PortfolioHome({ onNavigate }: PortfolioHomeProps) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="portfolio-site">
      <PortfolioHeader onNavigate={handleNavigate} />
      
      <Layout>
        {/* Hero Section */}
        <section className="portfolio-hero">
          <Container padding="lg">
            <div className="portfolio-hero__content">
              <Image
                src={getNonsense('abstractImage') as string}
                alt="Portrait"
                rounded="full"
                className="portfolio-hero__image"
                aspectRatio="1/1"
              />
              <div className="portfolio-hero__text">
                <Heading level={1}>
                  {getNonsense('personName')}
                </Heading>
                <Text>{getNonsense('introText')}</Text>
                <div className="portfolio-hero__buttons">
                  <Button variant="solid" onClick={() => handleNavigate("projects")}>
                    View My Work
                  </Button>
                  <Button variant="outline" onClick={() => handleNavigate("contact")}>
                    Get in Touch
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Intro Paragraph */}
        <section className="portfolio-intro">
          <Container padding="lg">
            <div className="portfolio-intro__text">
              <Text>{getNonsense('shortParagraph')}</Text>
            </div>
          </Container>
        </section>

        {/* Navigation Cards */}
        <section className="portfolio-cards-section">
          <Container padding="lg">
            <Heading level={2}>
              Explore
            </Heading>
            <div className="portfolio-cards">
              {/* Card 1: Resume - Image Left */}
              <Card className="portfolio-card" elevated>
                <div className="portfolio-card__layout portfolio-card__layout--image-left">
                  <Image
                    src={getNonsense('abstractImage') as string}
                    alt="Resume preview"
                    aspectRatio="4/3"
                    className="portfolio-card__image"
                  />
                  <div className="portfolio-card__text">
                    <Heading level={3}>{getNonsense('shortTitle')}</Heading>
                    <Text>{getNonsense('shortParagraph')}</Text>
                    <Button variant="solid" onClick={() => handleNavigate("resume")}>
                      {getNonsense('ctaText')}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Card 2: Projects - Image Bottom */}
              <Card className="portfolio-card" elevated>
                <div className="portfolio-card__layout portfolio-card__layout--image-bottom">
                  <div className="portfolio-card__text">
                    <Heading level={3}>{getNonsense('shortTitle')}</Heading>
                    <Text>{getNonsense('shortParagraph')}</Text>
                    <Button variant="solid" onClick={() => handleNavigate("projects")}>
                      {getNonsense('ctaText')}
                    </Button>
                  </div>
                  <Image
                    src={getNonsense('abstractImage') as string}
                    alt="Projects preview"
                    aspectRatio="16/9"
                    className="portfolio-card__image"
                  />
                </div>
              </Card>

              {/* Card 3: Contact - No Image */}
              <Card className="portfolio-card" elevated>
                <div className="portfolio-card__layout">
                  <div className="portfolio-card__text">
                    <Heading level={3}>{getNonsense('shortTitle')}</Heading>
                    <Text>{getNonsense('shortParagraph')}</Text>
                    <Button variant="solid" onClick={() => handleNavigate("contact")}>
                      {getNonsense('ctaText')}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </Container>
        </section>
      </Layout>

      <PortfolioFooter onNavigate={handleNavigate} />
    </div>
  );
}

export default PortfolioHome;
