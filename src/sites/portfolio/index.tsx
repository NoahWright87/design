import * as React from "react";
import { PortfolioHome } from "./Home.js";
import { PortfolioAbout } from "./About.js";
import { PortfolioProjects } from "./Projects.js";
import { PortfolioResume } from "./Resume.js";
import { PortfolioContact } from "./Contact.js";

export type PortfolioPage = "home" | "about" | "projects" | "resume" | "contact";

export interface PortfolioSiteProps {
  initialPage?: PortfolioPage;
}

export function PortfolioSite({ initialPage = "home" }: PortfolioSiteProps) {
  const [currentPage, setCurrentPage] = React.useState<PortfolioPage>(initialPage);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PortfolioPage);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pages: Record<PortfolioPage, React.ReactNode> = {
    home: <PortfolioHome onNavigate={handleNavigate} />,
    about: <PortfolioAbout onNavigate={handleNavigate} />,
    projects: <PortfolioProjects onNavigate={handleNavigate} />,
    resume: <PortfolioResume onNavigate={handleNavigate} />,
    contact: <PortfolioContact onNavigate={handleNavigate} />,
  };

  return <>{pages[currentPage]}</>;
}

export default PortfolioSite;

// Export individual pages for separate stories
export { PortfolioHome, PortfolioAbout, PortfolioProjects, PortfolioResume, PortfolioContact };
