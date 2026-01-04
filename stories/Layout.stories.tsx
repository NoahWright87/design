import type { Meta, StoryObj } from "@storybook/react";
import { Layout, Header, Footer, Text, Menu, MenuItem, Avatar, HamburgerMenu } from "../src";

const meta: Meta<typeof Layout> = {
  title: "Components/Layout",
  component: Layout,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Layout>;

const navItems = [
  <MenuItem key="home" label="Home" onClick={() => console.log("Home")} />,
  <MenuItem key="about" label="About" onClick={() => console.log("About")} />,
  <MenuItem key="contact" label="Contact" onClick={() => console.log("Contact")} />
];

const accountItems = [
  <MenuItem key="profile" label="Profile" onClick={() => console.log("Profile")} />,
  <MenuItem key="settings" label="Settings" onClick={() => console.log("Settings")} />,
  <MenuItem key="logout" label="Log out" onClick={() => console.log("Log out")} />
];

export const WithHeaderFooter: Story = {
  render: () => (
    <Layout 
      header={
        <Header 
          left={<Menu trigger={<HamburgerMenu />} items={navItems} align="left" />}
          center={<span>Example Text</span>}
          right={<Menu trigger={<Avatar label="User" />} items={accountItems} align="right" />}
        />
      } 
      footer={<Footer />}
    >
      <Text>Hello from inside Layout</Text>
    </Layout>
  )
};
