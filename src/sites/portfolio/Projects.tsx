import * as React from "react";
import { Layout } from "../../components/organisms/Layout/index.js";
import { Container } from "../../components/organisms/Container/Container.js";
import { Card } from "../../components/organisms/Card/index.js";
import { Heading } from "../../components/molecules/Heading/index.js";
import { Text } from "../../components/molecules/Text/index.js";
import { Button } from "../../components/molecules/Button/index.js";
import { Link } from "../../components/molecules/Link/index.js";
import { Image } from "../../components/molecules/Image/index.js";
import { Pill } from "../../components/molecules/Pill/index.js";
import { getNonsense } from "../../atoms/nonsense.js";
import PortfolioHeader from "./PortfolioHeader.js";
import PortfolioFooter from "./PortfolioFooter.js";
import "./portfolio.css";

export interface PortfolioProjectsProps {
  onNavigate?: (page: string) => void;
}

export function PortfolioProjects({ onNavigate }: PortfolioProjectsProps) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const projects = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    name: getNonsense('projectName'),
    description: getNonsense('shortParagraph'),
    image: getNonsense('abstractImage') as string,
    cta: getNonsense('ctaText'),
    skills: i < 4 ? [getNonsense('skillName'), getNonsense('skillName'), getNonsense('skillName')] : [],
  }));

  return (
    <div className="portfolio-site">
      <PortfolioHeader onNavigate={handleNavigate} />
      
      <Layout>
        <Container padding="lg">
          <div className="portfolio-section-title">
            <Heading level={1}>Projects</Heading>
          </div>

          <div className="portfolio-projects__intro">
            <Text>{getNonsense('shortParagraph')}</Text>
          </div>

          <div className="portfolio-projects__grid">
            {projects.map((project) => (
              <Card key={project.id}>
                <Image
                  src={project.image}
                  alt={project.name as string}
                  aspectRatio="16/9"
                  rounded="md"
                  className="portfolio-project-card__image"
                />
                <div className="portfolio-project-card__content">
                  <Heading level={3}>{project.name}</Heading>
                  <Text>{project.description}</Text>
                  {project.skills.length > 0 && (
                    <div className="portfolio-project-card__skills">
                      {project.skills.map((skill, idx) => (
                        <Pill key={idx} variant="primary" size="small">
                          {skill}
                        </Pill>
                      ))}
                    </div>
                  )}
                  <Link href="https://noahwright.dev">
                    <Button>{project.cta}</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Layout>

      <PortfolioFooter onNavigate={handleNavigate} />
    </div>
  );
}

export default PortfolioProjects;
