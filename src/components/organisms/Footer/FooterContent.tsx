import * as React from "react";

export type FooterContentProps = {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  bottom?: React.ReactNode;
  hasBottomSeparator?: boolean;
  children?: React.ReactNode;
};

/**
 * The slot markup shared by `Footer` and `SceneFooter`: a main row with
 * left / center / right slots (or plain children), plus an optional bottom strip.
 * Class names and styles live in `footer.css`.
 */
export function FooterContent({
  left,
  center,
  right,
  bottom,
  hasBottomSeparator = false,
  children,
}: FooterContentProps) {
  const hasSlots = left != null || center != null || right != null;

  return (
    <>
      <div className="nw-footer__main">
        {hasSlots ? (
          <>
            <div className="nw-footer__slot nw-footer__slot--left">{left}</div>
            <div className="nw-footer__slot nw-footer__slot--center">{center}</div>
            <div className="nw-footer__slot nw-footer__slot--right">{right}</div>
          </>
        ) : (
          children
        )}
      </div>
      {bottom != null && (
        <div className={`nw-footer__bottom${hasBottomSeparator ? " nw-footer__bottom--separated" : ""}`}>
          {bottom}
        </div>
      )}
    </>
  );
}
