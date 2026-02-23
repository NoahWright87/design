import * as React from "react";
import { Header } from "../../components/organisms/Header/index.js";
import { Menu } from "../../components/organisms/Menu/index.js";
import { MenuItem } from "../../components/molecules/MenuItem.js";
import { HamburgerMenu } from "../../components/molecules/HamburgerMenu/index.js";
import { Avatar } from "../../components/molecules/Avatar/index.js";
import { Button } from "../../components/molecules/Button/index.js";
import { Modal } from "../../components/organisms/Modal/index.js";
import { Text } from "../../components/molecules/Text/index.js";
import { Heading } from "../../components/molecules/Heading/index.js";
import { toggleThemeMode, getThemeMode } from "../../styles/themeToggle.js";
import { ToggleIcon } from "../../components/molecules/ToggleIcon/index.js";
import { getNonsense } from "../../atoms/nonsense.js";

export type PortfolioHeaderProps = {
  onNavigate?: (page: string) => void;
  currentPage?: string;
};

export function PortfolioHeader({ onNavigate }: PortfolioHeaderProps) {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [siteTitle] = React.useState(() => getNonsense('shortTitle') as string);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsDark(getThemeMode() === 'dark');
  }, []);

  function handleThemeToggle(toggled: boolean) {
    toggleThemeMode();
    setIsDark(toggled);
  }

  const navItems = [
    { text: 'Home', page: 'home' },
    { text: 'About', page: 'about' },
    { text: 'Projects', page: 'projects' },
    { text: 'Resume', page: 'resume' },
    { text: 'Contact', page: 'contact' },
  ];

  const avatarMenuItems = [
    { text: '🔐 Login', onClick: () => setShowLoginModal(true) },
  ];

  return (
    <>
      <Header
        left={
          <Menu
            trigger={<HamburgerMenu />}
            items={navItems.map(item => ({
              text: item.text,
              onClick: () => onNavigate?.(item.page)
            }))}
          />
        }
        center={
          <div className="portfolio-header__center">
            <Heading level={1}>{siteTitle}</Heading>
          </div>
        }
        right={
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <ToggleIcon
              preset="moon-sun"
              isToggled={isDark}
              onChange={handleThemeToggle}
            />
            <Menu
              trigger={<Avatar />}
              items={avatarMenuItems}
              align="right"
            />
          </div>
        }
      />

      <Modal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login"
      >
        <Text>If this were a real site, a login box would be here!</Text>
      </Modal>
    </>
  );
}

export default PortfolioHeader;
