import type { Meta, StoryObj } from "@storybook/react";
import { Header, Avatar, Menu, MenuItem, HamburgerMenu } from "../../src";
import { getNonsense } from "../../src/atoms/nonsense";

const meta: Meta = {
  title: "Examples/Header Integration",
  parameters: {
    layout: "fullscreen"
  }
};
export default meta;

type Story = StoryObj;

const navItems = [
  <MenuItem key="home" label="Home" onClick={() => console.log("Home")} />,
  <MenuItem key="about" label="About" onClick={() => console.log("About")} />,
  <MenuItem key="services" label="Services" onClick={() => console.log("Services")} />,
  <MenuItem key="contact" label="Contact" onClick={() => console.log("Contact")} />
];

const accountItems = [
  <MenuItem key="profile" label="Profile" onClick={() => console.log("Profile")} />,
  <MenuItem key="settings" label="Settings" onClick={() => console.log("Settings")} />,
  <MenuItem key="logout" label="Log out" onClick={() => console.log("Log out")} />
];

export const StandardAppHeader: Story = {
  render: () => (
    <div>
      <Header
        left={<Menu trigger={<HamburgerMenu />} items={navItems} align="left" />}
        center={<h1 style={{ margin: 0, fontSize: "1rem" }}>My Application</h1>}
        right={<Menu trigger={<Avatar label="Noah Wright" />} items={accountItems} align="right" />}
      />
      <div style={{ paddingTop: "60px", padding: "80px 20px 20px" }}>
        <p>Header is fixed at the top. Scroll to see it stick.</p>
        <p>Click the hamburger menu on the left or the avatar on the right to open menus.</p>
        <p>On mobile (resize your browser to &lt;600px width), menus will expand full-width with an overlay.</p>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>Filler content line {i + 1}</p>
        ))}
      </div>
    </div>
  )
};

export const MinimalPortfolio: Story = {
  render: () => (
    <div>
      <Header
        left={<Menu trigger={<HamburgerMenu />} items={navItems} align="left" />}
        center={<span style={{ fontWeight: "bold" }}>Noah Wright</span>}
        right={<Avatar src={getNonsense("abstractImage") as string} alt="Noah" />}
      />
      <div style={{ paddingTop: "60px", padding: "80px 20px 20px" }}>
        <h1>Portfolio Example</h1>
        <p>A minimal header layout with navigation and avatar.</p>
      </div>
    </div>
  )
};

export const LeftMenuOnly: Story = {
  render: () => (
    <div>
      <Header
        left={<Menu trigger={<HamburgerMenu />} items={navItems} align="left" />}
        center={<span>Centered Title</span>}
      />
      <div style={{ paddingTop: "60px", padding: "80px 20px 20px" }}>
        <p>Header with only a left menu.</p>
      </div>
    </div>
  )
};

export const RightMenuOnly: Story = {
  render: () => (
    <div>
      <Header
        center={<span>My App</span>}
        right={<Menu trigger={<Avatar label="U" />} items={accountItems} align="right" />}
      />
      <div style={{ paddingTop: "60px", padding: "80px 20px 20px" }}>
        <p>Header with only a right account menu.</p>
      </div>
    </div>
  )
};
