import type { Meta, StoryObj } from "@storybook/react";
import { Header, Menu, MenuItem, Button, getThemeMode, toggleThemeMode } from "../../src";

const meta: Meta<typeof Header> = {
  title: "Examples/Header Integration",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function ThemeToggle() {
  const [mode, setMode] = React.useState("light");

  React.useEffect(() => {
    setMode(getThemeMode());
  }, []);

  return (
    <button
      onClick={() => {
        const newMode = toggleThemeMode();
        setMode(newMode);
      }}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "1.5rem",
        padding: "0",
      }}
    >
      {mode === "dark" ? "☀️" : "🌙"}
    </button>
  );
}

import * as React from "react";

export const ResponsiveHeaderWithMenu: Story = {
  render: () => {
    const navItems = [
      { text: "Home", href: "/" },
      { text: "About", href: "/about" },
      { text: "Contact", href: "/contact" },
    ];

    return (
      <div style={{ minHeight: "100vh", background: "var(--background)" }}>
        <Header
          left={<span style={{ fontWeight: "bold" }}>MyApp</span>}
          center={<span style={{ fontSize: "0.9rem" }}>Home</span>}
          right={<ThemeToggle />}
          mobileTitle={<span>MA</span>}
          mobileMenu={<Menu trigger="📋" items={navItems} />}
          menuButtonLabel="Navigation"
        />

        <main style={{ padding: "20px", paddingTop: "80px" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h1>Responsive Header</h1>
            <p>
              On desktop: full navigation in center, logo on left, theme toggle on right.
            </p>
            <p>On mobile: hamburger menu, abbreviated title, theme toggle.</p>
          </div>
        </main>
      </div>
    );
  },
};

export const HeaderWithAvatarMenu: Story = {
  render: () => {
    return (
      <div style={{ minHeight: "100vh", background: "var(--background)" }}>
        <Header
          left={
            <span style={{ fontWeight: "bold" }}>Logo</span>
          }
          center={
            <Menu
              trigger="User Account"
              items={[
                { text: "Profile", href: "/profile" },
                { text: "Settings", href: "/settings" },
                { text: "Sign Out", href: "/logout" },
              ]}
              align="right"
            />
          }
          right={<ThemeToggle />}
          mobileTitle={<span>App</span>}
          menuButtonLabel="Menu"
        />

        <main style={{ padding: "20px", paddingTop: "80px" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h1>Header with Avatar Menu</h1>
            <p>Click the center menu to see user options.</p>
          </div>
        </main>
      </div>
    );
  },
};
