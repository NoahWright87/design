import type { Meta, StoryObj } from "@storybook/react";
import { Menu, MenuItem, Avatar, HamburgerMenu } from "../src";

const meta: Meta<typeof Menu> = {
  title: "Components/Organisms/Menu",
  component: Menu,
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "select",
      options: ["left", "right"],
      description: "Menu alignment"
    }
  }
};
export default meta;

type Story = StoryObj<typeof Menu>;

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

const disabledItems = [
  <MenuItem key="active" label="Active item" onClick={() => console.log("Active")} />,
  <MenuItem key="disabled" label="Disabled item" disabled onClick={() => console.log("Disabled")} />,
  <MenuItem key="last" label="Last item" onClick={() => console.log("Last")} />
];

export const WithHamburger: Story = {
  args: {
    trigger: <HamburgerMenu />,
    items: navItems,
    align: "left"
  }
};

export const WithAvatar: Story = {
  render: (args) => (
    <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
      <Menu {...args} />
    </div>
  ),
  args: {
    trigger: <Avatar label="Noah Wright" />,
    items: accountItems,
    align: "right"
  }
};

export const LeftAligned: Story = {
  args: {
    trigger: <button type="button">Menu ▼</button>,
    items: navItems,
    align: "left"
  }
};

export const RightAligned: Story = {
  render: (args) => (
    <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
      <Menu {...args} />
    </div>
  ),
  args: {
    trigger: <button type="button">Account ▼</button>,
    items: accountItems,
    align: "right"
  }
};

export const WithDisabledItem: Story = {
  args: {
    trigger: <HamburgerMenu />,
    items: disabledItems,
    align: "left"
  }
};
