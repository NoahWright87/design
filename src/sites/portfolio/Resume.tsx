import * as React from "react";
import { Layout } from "../../components/organisms/Layout/index.js";
import { Container } from "../../components/organisms/Container/Container.js";
import { Heading } from "../../components/molecules/Heading/index.js";
import { Text } from "../../components/molecules/Text/index.js";
import { Button } from "../../components/molecules/Button/index.js";
import { Image } from "../../components/molecules/Image/index.js";
import { Pill } from "../../components/molecules/Pill/index.js";
import { getNonsense } from "../../atoms/nonsense.js";
import PortfolioHeader from "./PortfolioHeader.js";
import PortfolioFooter from "./PortfolioFooter.js";
import "./portfolio.css";

export interface PortfolioResumeProps {
  onNavigate?: (page: string) => void;
}

export function PortfolioResume({ onNavigate }: PortfolioResumeProps) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const [expandedEntries, setExpandedEntries] = React.useState<Set<string>>(new Set());

  function toggleExpanded(key: string) {
    setExpandedEntries(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const workExperience = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    title: getNonsense('jobTitle'),
    company: getNonsense('companyName'),
    date: getNonsense('date'),
    description: getNonsense('longParagraph'),
    accomplishments: [getNonsense('accomplishment'), getNonsense('accomplishment'), getNonsense('accomplishment'), getNonsense('accomplishment')],
    skills: [getNonsense('skillName'), getNonsense('skillName'), getNonsense('skillName'), getNonsense('skillName'), getNonsense('skillName')],
    hasLogo: i < 3,
    logo: i < 3 ? (getNonsense('abstractImage') as string) : '',
  }));

  const education = Array.from({ length: 2 }, (_, i) => ({
    id: i,
    degree: getNonsense('shortTitle'),
    school: getNonsense('companyName'),
    date: getNonsense('date'),
    description: getNonsense('shortParagraph'),
    coursework: [getNonsense('skillName'), getNonsense('skillName'), getNonsense('skillName'), getNonsense('skillName')],
    hasLogo: i === 0,
    logo: i === 0 ? (getNonsense('abstractImage') as string) : '',
  }));

  const awards = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    name: getNonsense('awardName'),
    issuer: getNonsense('companyName'),
    date: getNonsense('date'),
    description: getNonsense('shortParagraph'),
  }));

  const skillCategories = [
    {
      category: getNonsense('shortTitle'),
      skills: [getNonsense('skillName'), getNonsense('skillName'), getNonsense('skillName'), getNonsense('skillName'), getNonsense('skillName')],
    },
    {
      category: getNonsense('shortTitle'),
      skills: [getNonsense('skillName'), getNonsense('skillName'), getNonsense('skillName'), getNonsense('skillName'), getNonsense('skillName'), getNonsense('skillName')],
    },
    {
      category: getNonsense('shortTitle'),
      skills: [getNonsense('skillName'), getNonsense('skillName'), getNonsense('skillName'), getNonsense('skillName')],
    },
  ];

  return (
    <div className="portfolio-site">
      <PortfolioHeader onNavigate={handleNavigate} />
      
      <Layout>
        <Container padding="lg">
          <div className="portfolio-section-title">
            <Heading level={1}>Resume</Heading>
          </div>

          {/* Work Experience Section */}
          <div className="portfolio-resume__section">
            <Heading level={2}>Work Experience</Heading>
            <div className="portfolio-resume__timeline">
            {workExperience.map((job, i) => (
              <div key={job.id} className="portfolio-resume__entry" style={{ '--entry-i': i } as React.CSSProperties}>
                {job.hasLogo && (
                  <Image
                    src={job.logo}
                    alt=""
                    aspectRatio="1/1"
                    rounded="md"
                    className="portfolio-resume__logo"
                  />
                )}
                <div className="portfolio-resume__content">
                  <div className="portfolio-resume__header">
                    <Heading level={3}>{job.title}</Heading>
                    <Text>{job.company}</Text>
                    <Text>{job.date}</Text>
                  </div>
                  <Text>{job.description}</Text>
                  <div className="portfolio-resume__skills">
                    {job.skills.map((skill, idx) => (
                      <Pill key={idx} variant="secondary" size="small">
                        {skill}
                      </Pill>
                    ))}
                  </div>
                  <button
                    className="portfolio-resume__expand-btn"
                    onClick={() => toggleExpanded(`work-${job.id}`)}
                    aria-expanded={expandedEntries.has(`work-${job.id}`)}
                  >
                    {expandedEntries.has(`work-${job.id}`) ? "Hide details ▲" : "Show details ▼"}
                  </button>
                  {expandedEntries.has(`work-${job.id}`) && (
                    <ul className="portfolio-resume__accomplishments portfolio-resume__accomplishments--expanded">
                      {job.accomplishments.map((acc, idx) => (
                        <li key={idx}>{acc}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="portfolio-resume__section">
            <Heading level={2}>Education</Heading>
            <div className="portfolio-resume__timeline">
            {education.map((edu, i) => (
              <div key={edu.id} className="portfolio-resume__entry" style={{ '--entry-i': i } as React.CSSProperties}>
                {edu.hasLogo && (
                  <Image
                    src={edu.logo}
                    alt=""
                    aspectRatio="1/1"
                    rounded="md"
                    className="portfolio-resume__logo"
                  />
                )}
                <div className="portfolio-resume__content">
                  <div className="portfolio-resume__header">
                    <Heading level={3}>{edu.degree}</Heading>
                    <Text>{edu.school}</Text>
                    <Text>{edu.date}</Text>
                  </div>
                  <Text>{edu.description}</Text>
                  <ul className="portfolio-resume__accomplishments">
                    {edu.coursework.map((course, idx) => (
                      <li key={idx}>{course}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className="portfolio-resume__section">
            <Heading level={2}>Skills</Heading>
            {skillCategories.map((cat, idx) => (
              <div key={idx} className="portfolio-resume__skill-category">
                <Heading level={3}>{cat.category}</Heading>
                <div className="portfolio-resume__skills">
                  {cat.skills.map((skill, sidx) => (
                    <Pill key={sidx} variant="primary" size="small">
                      {skill}
                    </Pill>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Awards Section */}
          <div className="portfolio-resume__section">
            <Heading level={2}>Awards & Certifications</Heading>
            {awards.map((award) => (
              <div key={award.id} className="portfolio-resume__entry">
                <div className="portfolio-resume__content">
                  <div className="portfolio-resume__header">
                    <Heading level={3}>{award.name}</Heading>
                    <Text>{award.issuer}</Text>
                    <Text>{award.date}</Text>
                  </div>
                  <Text>{award.description}</Text>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="portfolio-resume__cta">
            <Button>
              {getNonsense('ctaText')}
            </Button>
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

export default PortfolioResume;
