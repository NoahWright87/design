import * as React from "react";
import { Layout } from "../../components/organisms/Layout/index.js";
import { Container } from "../../components/organisms/Container/Container.js";
import { Card, CardGrid } from "../../components/organisms/Card/index.js";
import { Heading } from "../../components/molecules/Heading/index.js";
import { Text } from "../../components/molecules/Text/index.js";
import { Button } from "../../components/molecules/Button/index.js";
import { Link } from "../../components/molecules/Link/index.js";
import { Image } from "../../components/molecules/Image/index.js";
import { Pill } from "../../components/molecules/Pill/index.js";
import { Select } from "../../components/molecules/Select/index.js";
import { getNonsense } from "../../atoms/nonsense.js";
import PortfolioHeader from "./PortfolioHeader.js";
import PortfolioFooter from "./PortfolioFooter.js";
import "./portfolio.css";

export interface PortfolioProjectsProps {
  onNavigate?: (page: string) => void;
}

const PROJECT_CATEGORIES = ["Design", "Development", "Strategy", "Research", "Branding"] as const;
type ProjectCategory = typeof PROJECT_CATEGORIES[number];

type Project = {
  id: number;
  name: string;
  description: string;
  image: string;
  cta: string;
  skills: string[];
  category: ProjectCategory;
};

export function PortfolioProjects({ onNavigate }: PortfolioProjectsProps) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const [projects] = React.useState<Project[]>(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      name: getNonsense('projectName', { seed: `proj-name-${i}` }) as string,
      description: getNonsense('shortParagraph', { seed: `proj-desc-${i}` }) as string,
      image: getNonsense('abstractImage', { seed: `proj-img-${i}` }) as string,
      cta: getNonsense('ctaText', { seed: `proj-cta-${i}` }) as string,
      skills: [
        getNonsense('skillName', { seed: `proj-skill-${i}-0` }) as string,
        getNonsense('skillName', { seed: `proj-skill-${i}-1` }) as string,
        getNonsense('skillName', { seed: `proj-skill-${i}-2` }) as string,
      ],
      category: PROJECT_CATEGORIES[i % PROJECT_CATEGORIES.length],
    }))
  );

  const [intro] = React.useState(() => getNonsense('shortParagraph') as string);

  const allSkills = React.useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => p.skills.forEach(s => set.add(s)));
    return Array.from(set).sort();
  }, [projects]);

  const [activeSkills, setActiveSkills] = React.useState<Set<string>>(new Set());
  const [sortOrder, setSortOrder] = React.useState<string>("");

  function toggleSkill(skill: string) {
    setActiveSkills(prev => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      return next;
    });
  }

  const displayedProjects = React.useMemo(() => {
    let list = projects;
    if (activeSkills.size > 0) {
      list = list.filter(p => p.skills.some(s => activeSkills.has(s)));
    }
    if (sortOrder === "az") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "za") {
      list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    }
    return list;
  }, [projects, activeSkills, sortOrder]);

  return (
    <div className="portfolio-site">
      <PortfolioHeader onNavigate={handleNavigate} />

      <Layout>
        <Container padding="lg">
          <div className="portfolio-section-title">
            <Heading level={1} gradient animateIn>Projects</Heading>
          </div>

          <div className="portfolio-projects__intro">
            <Text>{intro}</Text>
          </div>

          {/* Filter + sort toolbar */}
          <div className="portfolio-projects__toolbar">
            <div className="portfolio-projects__filters" role="group" aria-label="Filter by skill">
              <button
                className={`portfolio-projects__filter-chip${activeSkills.size === 0 ? " portfolio-projects__filter-chip--active" : ""}`}
                onClick={() => setActiveSkills(new Set())}
              >
                All
              </button>
              {allSkills.map(skill => (
                <button
                  key={skill}
                  className={`portfolio-projects__filter-chip${activeSkills.has(skill) ? " portfolio-projects__filter-chip--active" : ""}`}
                  onClick={() => toggleSkill(skill)}
                  aria-pressed={activeSkills.has(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="portfolio-projects__sort">
              <Select
                label="Sort"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                placeholder="Default"
              >
                <option value="az">A – Z</option>
                <option value="za">Z – A</option>
              </Select>
            </div>
          </div>

          {displayedProjects.length === 0 && (
            <div className="portfolio-projects__empty">
              <Text tone="muted">No projects match the selected filters.</Text>
            </div>
          )}

          <CardGrid minCardWidth="300px" gap="md">
            {displayedProjects.map((project) => (
              <Card key={project.id}>
                <Image
                  src={project.image}
                  alt={project.name}
                  aspectRatio="16/9"
                  rounded="md"
                  className="portfolio-project-card__image"
                />
                <div className="portfolio-project-card__content">
                  <div className="portfolio-project-card__category">
                    <Pill variant="secondary" size="small">{project.category}</Pill>
                  </div>
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
                  <div className="portfolio-project-card__button">
                    <Button>{project.cta}</Button>
                  </div>
                </div>
              </Card>
            ))}
          </CardGrid>
        </Container>
      </Layout>

      <PortfolioFooter onNavigate={handleNavigate} />
    </div>
  );
}

export default PortfolioProjects;
