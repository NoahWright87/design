import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Header, Avatar, Menu, MenuItem, MenuContext, HamburgerMenu } from "../../src";
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

type RouteKey = "home" | "about" | "services" | "contact";

function ResourcesSubmenu() {
  const parent = React.useContext(MenuContext);
  const root = React.useRef<HTMLDivElement>(null);
  const [focusRequested, setFocusRequested] = React.useState(false);
  React.useEffect(() => {
    if (focusRequested) {
      root.current?.querySelector('[role="menu"]')?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
      setFocusRequested(false);
    }
  }, [focusRequested]);
  return <div data-resources ref={root} onKeyDown={event => {
    if (event.key === 'ArrowRight') {
      event.preventDefault(); event.stopPropagation();
      const trigger = root.current?.querySelector<HTMLButtonElement>('button');
      if (trigger?.getAttribute('aria-expanded') !== 'true') trigger?.click();
      setFocusRequested(true);
    }
    if (event.key === 'ArrowLeft' || event.key === 'Escape') {
      const trigger = root.current?.querySelector<HTMLButtonElement>('button');
      if (trigger?.getAttribute('aria-expanded') === 'true') {
        event.preventDefault(); event.stopPropagation(); trigger.click(); trigger.focus();
      }
    }
  }}>
    <style>{'[data-resources] .nw-menu .nw-menu__panel { position: static; width: auto; min-width: 0; margin-top: 6px; animation-name: nw-menu-enter; } [data-resources] .nw-menu .nw-menu__panel--closing { animation-name: nw-menu-exit; } [data-resources] .nw-menu__overlay { display: none; }'}</style>
    <Menu trigger={<button type="button" role="menuitem" style={{ border: 0, padding: '10px 12px', background: 'var(--background)', color: 'var(--foreground)', font: 'inherit', cursor: 'pointer' }}>Resources</button>} items={[
      <MenuItem key="about" text="About the studio" href="#about" onClick={() => parent?.close()} />,
      <MenuItem key="contact" text="Contact the studio" href="#contact" onClick={() => parent?.close()} />,
    ]} />
  </div>;
}

const routeContent: Record<RouteKey, { title: string; body: string }> = {
  home: {
    title: "Home",
    body: "Recent projects, writing, and updates."
  },
  about: {
    title: "About",
    body: "Independent software design and development."
  },
  services: {
    title: "Services",
    body: "Product design, development, and technical consulting."
  },
  contact: {
    title: "Contact",
    body: "Discuss a project or get in touch."
  }
};

function RoutedHeaderDemo() {
  const [route, setRoute] = React.useState<RouteKey>("home");
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const syncRoute = () => {
      const key = window.location.hash.slice(1);
      setRoute(Object.prototype.hasOwnProperty.call(routeContent, key) ? key as RouteKey : "home");
    };
    syncRoute();
    window.addEventListener("hashchange", syncRoute);

    const handleShortcut = (event: KeyboardEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (event.key === "Escape") {
        const menu = root.querySelector(".nw-menu--open");
        menu?.querySelector<HTMLButtonElement>("button")?.focus();
        return;
      }
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat) return;
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable='true']")) return;
      const selector = event.key.toLowerCase() === "n" ? "[data-navigation-menu] button"
        : event.key.toLowerCase() === "a" ? "[data-account-menu-trigger]" : null;
      const trigger = selector ? root.querySelector<HTMLButtonElement>(selector) : null;
      if (trigger) {
        event.preventDefault();
        trigger.focus();
        trigger.click();
        window.requestAnimationFrame(() => {
          trigger.closest(".nw-menu")?.querySelector<HTMLElement>("[role='menuitem']")?.focus();
        });
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
      window.removeEventListener("hashchange", syncRoute);
    };
  }, []);

  const routedNavItems = (Object.keys(routeContent) as RouteKey[]).map((key) => (
    <MenuItem key={key} label={routeContent[key].title} href={`#${key}`} current={route === key} />
  ));
  routedNavItems.push(<ResourcesSubmenu key="resources" />);

  const routedAccountItems = [
    <MenuItem key="profile" label="Profile" href="#about" />,
    <MenuItem key="settings" label="Settings" href="#services" />,
    <MenuItem key="logout" label="Log out" href="#home" />
  ];

  return (
    <div ref={rootRef}>
      <Header
        left={<div data-navigation-menu><Menu trigger={<HamburgerMenu />} items={routedNavItems} align="left" /></div>}
        center={<h1 style={{ margin: 0, fontSize: "1rem" }}>{routeContent[route].title}</h1>}
        right={
          <Menu
            trigger={
              <button
                type="button"
                data-account-menu-trigger
                style={{
                  border: "1px solid var(--overlay)",
                  borderRadius: 8,
                  background: "var(--background)",
                  color: "var(--foreground)",
                  padding: "0.35rem 0.5rem",
                  cursor: "pointer"
                }}
              >
                Account
              </button>
            }
            items={routedAccountItems}
            align="right"
          />
        }
      />
      <main style={{ padding: "80px 20px 20px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h2>{routeContent[route].title}</h2>
          <p>{routeContent[route].body}</p>
        </div>
      </main>
    </div>
  );
}

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

export const RoutedApplicationHeader: Story = {
  render: () => <RoutedHeaderDemo />
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
