import * as React from "react";
import "./header.css";

export type HeaderProps = {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  /** Content rendered in the mobile sheet; defaults to right, then left. */
  mobileMenu?: React.ReactNode;
  /** Optional title shown on mobile instead of center. */
  mobileTitle?: React.ReactNode;
  /** Accessible label for the built-in menu button. */
  menuButtonLabel?: string;
};

export function Header({
  left,
  center,
  right,
  mobileMenu,
  mobileTitle,
  menuButtonLabel,
}: HeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const mobileContent = mobileMenu ?? right ?? left;
  const showMobileMenu = Boolean(mobileContent);

  const toggleMenu = () => {
    if (!showMobileMenu) return;
    setIsOpen((open) => !open);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={`nw-header${isOpen ? " nw-header--mobile-open" : ""}`}
      role="banner"
    >
      <div className="nw-header__slot nw-header__slot--left">
        {showMobileMenu ? (
          <button
            type="button"
            className="nw-header__menu-button"
            aria-label={menuButtonLabel ?? "Toggle menu"}
            aria-expanded={isOpen}
            onClick={toggleMenu}
          >
            <span className="nw-header__menu-icon" aria-hidden="true" />
          </button>
        ) : null}
        <div className="nw-header__slot-content">{left}</div>
      </div>

      <div className="nw-header__slot nw-header__slot--center">
        <span className="nw-header__center nw-header__center--desktop">{center}</span>
        <span className="nw-header__center nw-header__center--mobile">
          {mobileTitle ?? center}
        </span>
      </div>

      <div className="nw-header__slot nw-header__slot--right">{right}</div>

      {showMobileMenu ? (
        <>
          <div className="nw-header__mobile-overlay" onClick={closeMenu} />
          <div className="nw-header__mobile-panel">{mobileContent}</div>
        </>
      ) : null}
    </header>
  );
}

export default Header;
