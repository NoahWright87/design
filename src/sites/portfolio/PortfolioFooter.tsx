import * as React from "react";
import { Footer } from "../../components/organisms/Footer/index.js";
import { Link } from "../../components/molecules/Link/index.js";
import { getNonsense } from "../../atoms/nonsense.js";

export type PortfolioFooterProps = {
  onNavigate?: (page: string) => void;
};

export function PortfolioFooter({ onNavigate }: PortfolioFooterProps) {
  const tooltipPrefixes = ['Follow me on', 'Connect on', 'Find me on', 'Check out'];
  const socialSites = [
    { name: getNonsense('socialSiteName') as string, icon: '♥' },
    { name: getNonsense('socialSiteName') as string, icon: '★' },
    { name: getNonsense('socialSiteName') as string, icon: '◆' },
    { name: getNonsense('socialSiteName') as string, icon: '●' },
  ];

  return (
    <Footer>
      <div className="portfolio-footer__grid">
        <div className="portfolio-footer__left">
          <span>Follow:</span>
          {socialSites.map((site, idx) => (
            <span key={idx} title={`${tooltipPrefixes[idx % tooltipPrefixes.length]} ${site.name}`}>
              <Link href="#" aria-label={site.name}>
                {site.icon}
              </Link>
            </span>
          ))}
        </div>
        
        <div className="portfolio-footer__center">
          Copyright © <Link href="https://noahwright.dev">Noah Wright</Link> 2026
        </div>
        
        <div className="portfolio-footer__right">
          Powered by React • TypeScript • Storybook
        </div>
      </div>
    </Footer>
  );
}

export default PortfolioFooter;
