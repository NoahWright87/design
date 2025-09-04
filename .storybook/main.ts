import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: { name: "@storybook/react-vite", options: {} },
  stories: ["../stories/**/*.stories.@(tsx|mdx)"],
  addons: ["@storybook/addon-essentials"]
};

export default config;
