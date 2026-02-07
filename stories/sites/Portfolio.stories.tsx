import type { Meta, StoryObj } from "@storybook/react";
import { PortfolioSite, PortfolioHome, PortfolioAbout, PortfolioProjects, PortfolioResume, PortfolioContact } from "../../src/sites/portfolio/index.js";

const meta = {
  title: "Sites/Personal Portfolio",
  component: PortfolioSite,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PortfolioSite>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Full portfolio site with navigation. Click links in the header to navigate between pages.
 * 
 * You can also open this site in a new tab for a standalone experience.
 */
export const FullSite: Story = {
  args: {
    initialPage: "home",
  },
};

/**
 * Home page with hero section, intro, and navigation cards.
 */
export const Home: Story = {
  render: () => <PortfolioHome onNavigate={(page) => console.log('Navigate to:', page)} />,
};

/**
 * About page with alternating image/text sections.
 */
export const About: Story = {
  render: () => <PortfolioAbout onNavigate={(page) => console.log('Navigate to:', page)} />,
};

/**
 * Projects page with grid of project cards.
 */
export const Projects: Story = {
  render: () => <PortfolioProjects onNavigate={(page) => console.log('Navigate to:', page)} />,
};

/**
 * Resume page with work experience, education, skills, and awards.
 */
export const Resume: Story = {
  render: () => <PortfolioResume onNavigate={(page) => console.log('Navigate to:', page)} />,
};

/**
 * Contact page with form, modal, and social links.
 */
export const Contact: Story = {
  render: () => <PortfolioContact onNavigate={(page) => console.log('Navigate to:', page)} />,
};
