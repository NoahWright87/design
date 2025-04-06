import React from 'react';
import styled from '@emotion/styled';
import { Button } from '../src/components/Button/Button';
import { Footer } from '../src/components/Footer/Footer';
import { Header } from '../src/components/Header/Header';
import { ThemeProvider } from '../src/tokens/ThemeProvider';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  color: var(--color-foreground);
`;

const PageContent = styled.main`
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageSection = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: var(--color-foreground);
`;

const SectionText = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: var(--color-foreground);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const FeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 1.5rem 0;
`;

const FeatureItem = styled.li`
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
  color: var(--color-foreground);

  &::before {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--color-primary);
  }
`;

const PageContentComponent: React.FC = () => {
  return (
    <PageContainer>
      <Header 
        navItems={[
          { label: 'Home', href: '/' },
          { label: 'Components', href: '/components' },
          { label: 'Documentation', href: '/docs' },
          { label: 'About', href: '/about' }
        ]}
      />
      
      <PageContent>
        <PageSection>
          <SectionTitle>Getting Started</SectionTitle>
          <SectionText>
            Our design system provides a comprehensive set of components that follow modern design principles
            and accessibility standards. Each component is built with flexibility and customization in mind.
          </SectionText>
          <ButtonGroup>
            <Button variant="primary">View Documentation</Button>
            <Button variant="secondary">Browse Components</Button>
          </ButtonGroup>
        </PageSection>

        <PageSection>
          <SectionTitle>Key Features</SectionTitle>
          <FeatureList>
            <FeatureItem>Consistent design language across all products</FeatureItem>
            <FeatureItem>Fully accessible components</FeatureItem>
            <FeatureItem>Responsive and mobile-friendly</FeatureItem>
            <FeatureItem>Easy to customize and extend</FeatureItem>
          </FeatureList>
          <Button variant="outline">Learn More</Button>
        </PageSection>
      </PageContent>

      <Footer />
    </PageContainer>
  );
};

export const Page: React.FC = () => {
  return (
    <ThemeProvider>
      <PageContentComponent />
    </ThemeProvider>
  );
}; 