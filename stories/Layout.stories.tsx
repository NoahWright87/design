import type { Meta, StoryObj } from "@storybook/react";
import { Layout, Header, Footer, Text } from "../src";

const meta: Meta<typeof Layout> = {
  title: "Components/Layout",
  component: Layout
};
export default meta;

type Story = StoryObj<typeof Layout>;

export const WithHeaderFooter: Story = {
  render: () => (
    <Layout header={<Header />} footer={<Footer />}>
      <Text>Hello from inside Layout</Text>
    </Layout>
  )
};
