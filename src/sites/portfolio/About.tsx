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

/**
 * Animates an element into view when it enters the viewport.
 * Respects prefers-reduced-motion automatically via CSS.
 */
function useScrollReveal(): [React.RefCallback<HTMLElement>, boolean] {
  const [visible, setVisible] = React.useState(false);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  const ref = React.useCallback((el: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    observerRef.current = observer;
  }, []);

  return [ref, visible];
}

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, visible] = useScrollReveal();
  const cls = [
    className,
    "portfolio-about__section--reveal",
    visible && "portfolio-about__section--visible",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref as React.RefCallback<HTMLDivElement>} className={cls}>
      {children}
    </div>
  );
}

export function PortfolioAbout({ onNavigate }: PortfolioAboutProps) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const [content] = React.useState(() => ({
    section1: { title: getNonsense('shortTitle') as string, body: getNonsense('longParagraph') as string },
    section2: { title: getNonsense('shortTitle') as string, body: getNonsense('shortParagraph') as string },
    section3: { title: getNonsense('shortTitle') as string, body: getNonsense('longParagraph') as string },
    section4: { title: getNonsense('shortTitle') as string, body: getNonsense('longParagraph') as string },
    ctaText: getNonsense('ctaText') as string,
    ctaBody: getNonsense('shortParagraph') as string,
    testimonials: Array.from({ length: 3 }, () => ({
      quote: getNonsense('testimonialQuote') as string,
      name: getNonsense('personName') as string,
      role: `${getNonsense('jobTitle')}, ${getNonsense('companyName')}`,
    })),
    images: Array.from({ length: 4 }, () => getNonsense('abstractImage') as string),
  }));

  return (
    <div className="portfolio-site">
      <PortfolioHeader onNavigate={handleNavigate} />

      <Layout>
        <Container padding="lg">
          <div className="portfolio-section-title">
            <Heading level={1}>About</Heading>
          </div>

          {/* Section 1: Image Left, Text Right */}
          <RevealSection className="portfolio-about__section portfolio-about__section--image-left">
            <Image
              src={content.images[0]}
              alt="About illustration"
              aspectRatio="4/3"
              rounded="md"
              className="portfolio-about__image"
            />
            <div className="portfolio-about__text">
              <Heading level={2}>{content.section1.title}</Heading>
              <Text>{content.section1.body}</Text>
            </div>
          </RevealSection>

          {/* Section 2: Text Left, Image Right */}
          <RevealSection className="portfolio-about__section portfolio-about__section--image-right">
            <Image
              src={content.images[1]}
              alt="About illustration"
              aspectRatio="4/3"
              rounded="md"
              className="portfolio-about__image"
            />
            <div className="portfolio-about__text">
              <Heading level={2}>{content.section2.title}</Heading>
              <Text>{content.section2.body}</Text>
            </div>
          </RevealSection>

          {/* Section 3: Image Only */}
          <RevealSection className="portfolio-about__section">
            <Image
              src={content.images[2]}
              alt="Visual break"
              aspectRatio="21/9"
              rounded="md"
            />
          </RevealSection>

          {/* Section 4: Text Only */}
          <RevealSection className="portfolio-about__section">
            <div className="portfolio-about__text">
              <Heading level={2}>{content.section3.title}</Heading>
              <Text>{content.section3.body}</Text>
            </div>
          </RevealSection>

          {/* Section 5: Image Left, Text Right */}
          <RevealSection className="portfolio-about__section portfolio-about__section--image-left">
            <Image
              src={content.images[3]}
              alt="About illustration"
              aspectRatio="4/3"
              rounded="md"
              className="portfolio-about__image"
            />
            <div className="portfolio-about__text">
              <Heading level={2}>{content.section4.title}</Heading>
              <Text>{content.section4.body}</Text>
            </div>
          </RevealSection>

          {/* Testimonials */}
          <RevealSection className="portfolio-about__testimonials">
            <div className="portfolio-about__testimonials-title">
              <Heading level={2}>What People Say</Heading>
            </div>
            <div className="portfolio-about__testimonials-grid">
              {content.testimonials.map((t, i) => (
                <div key={i} className="portfolio-about__testimonial">
                  <Text className="portfolio-about__testimonial-quote">"{t.quote}"</Text>
                  <div>
                    <div className="portfolio-about__testimonial-author">{t.name}</div>
                    <div className="portfolio-about__testimonial-role">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>

          {/* Centered CTA */}
          <div className="portfolio-about__cta">
            <div className="portfolio-about__cta-text">
              <Text>{content.ctaBody}</Text>
            </div>
            <Button onClick={() => handleNavigate("contact")}>
              {content.ctaText}
            </Button>
          </div>
        </Container>
      </Layout>

      <PortfolioFooter onNavigate={handleNavigate} />
    </div>
  );
}

export default PortfolioAbout;
