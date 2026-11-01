import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Header, Menu, MenuItem, Button, ToggleIcon, getThemeMode, toggleThemeMode, initThemeMode, subscribeThemeMode } from "../../src";

const meta: Meta<typeof Header> = {
  title: "Examples/Header Responsive",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function DrawerHeaderDemo() {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState('Home');
  const buttonStyle: React.CSSProperties = {
    border: '1px solid var(--overlay)', borderRadius: 6, padding: '10px 14px',
    background: 'var(--background)', color: 'var(--foreground)', cursor: 'pointer',
    font: 'inherit', textAlign: 'left',
  };

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLButtonElement>('button')?.focus();
    }
    if (!open && dialog?.open) dialog.close();
    if (!open || !dialog) return;
    const handleOutside = (event: PointerEvent) => {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutside, true);
    return () => document.removeEventListener('pointerdown', handleOutside, true);
  }, [open]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <Header
        left={<button ref={triggerRef} style={buttonStyle} type="button" aria-label="Open navigation drawer" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>Menu</button>}
        center={<span>{page}</span>}
        right={<ThemeToggle />}
      />
      <main style={{ padding: 24 }}><h1>{page}</h1></main>
      <dialog
        ref={dialogRef}
        aria-label="Navigation drawer"
        onCancel={() => setOpen(false)}
        onClose={() => { setOpen(false); triggerRef.current?.focus(); }}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return;
          const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button');
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (event.shiftKey && event.target === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && event.target === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}
        style={{ margin: 0, width: 'min(320px, 85vw)', height: '100vh', maxHeight: '100vh', maxWidth: '85vw', boxSizing: 'border-box', border: '1px solid var(--overlay)', background: 'var(--background)', color: 'var(--foreground)', padding: 24 }}
      >
        <div onClick={(event) => event.stopPropagation()}>
          <button style={buttonStyle} type="button" aria-label="Close navigation drawer" onClick={() => setOpen(false)}>Close</button>
          <h2>Navigation</h2>
          <nav aria-label="Main navigation" style={{ display: 'grid', gap: 16 }}>
            {['Home', 'About', 'Contact'].map((name) => (
              <button key={name} style={{ ...buttonStyle, color: page === name ? 'var(--primary)' : 'var(--foreground)' }} type="button" aria-current={page === name ? 'page' : undefined} onClick={() => { setPage(name); setOpen(false); }}>{name}</button>
            ))}
          </nav>
        </div>
      </dialog>
    </div>
  );
}

export const NavigationDrawer: Story = { render: () => <DrawerHeaderDemo /> };

function ThemeToggle() {
  const [mode, setMode] = React.useState("light");

  React.useEffect(() => {
    // Apply persisted preference (localStorage → prefers-color-scheme → light)
    const resolved = initThemeMode();
    setMode(resolved);

    // Keyboard shortcut: Alt+D toggles dark mode
    function handleKey(e: KeyboardEvent) {
      if (e.altKey && e.key === "d") {
        const newMode = toggleThemeMode();
        setMode(newMode);
      }
    }
    document.addEventListener("keydown", handleKey);
    const unsubscribe = subscribeThemeMode(setMode);
    return () => {
      document.removeEventListener("keydown", handleKey);
      unsubscribe();
    };
  }, []);

  return (
    <ToggleIcon
      preset="moon-sun"
      isToggled={mode === "dark"}
      onChange={() => setMode(toggleThemeMode())}
      size="lg"
    />
  );
}

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
          left={<span style={{ fontWeight: "bold" }}>🏠</span>}
          leftLabel="MyApp"
          center={<span>📋</span>}
          centerLabel="Home"
          right={<ThemeToggle />}
          rightLabel="Theme"
        />

        <main style={{ padding: "20px", paddingTop: "80px" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h1>Responsive Header</h1>
            <p>
              On desktop: labels appear next to elements.
            </p>
            <p>On mobile: only icons/elements visible, labels hidden.</p>
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
            <span style={{ fontWeight: "bold" }}>🌐</span>
          }
          leftLabel="Logo"
          center={
            <Menu
              trigger="User"
              items={[
                { text: "Profile", href: "/profile" },
                { text: "Settings", href: "/settings" },
                { text: "Sign Out", href: "/logout" },
              ]}
              align="right"
            />
          }
          centerLabel="Account"
          right={<ThemeToggle />}
          rightLabel="Theme"
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
