"use client";
import * as React from "react";
import { useEffect, useRef } from "react";
import "./modal.css";

export type ModalAction = "confirm" | "cancel" | "custom";

export interface ModalActionProps {
  label: string;
  variant?: "primary" | "secondary" | "confirm" | "danger";
  onClick?: () => void;
  /** Optional identifier passed to onClose callback. Defaults to label. */
  id?: string;
}

export interface ModalProps {
  /**
   * Whether the modal is open.
   */
  open: boolean;

  /**
   * Called when the modal should close (backdrop click, close button, or action).
   * Receives the action id/label, or undefined if closed via backdrop/escape.
   */
  onClose: (action?: string) => void;

  /**
   * Modal title.
   */
  title?: React.ReactNode;

  /**
   * Modal content.
   */
  children?: React.ReactNode;

  /**
   * Custom action buttons. If not provided, shows a single "Okay" button.
   */
  actions?: ModalActionProps[];

  /**
   * Whether clicking outside the modal closes it. Default true.
   */
  closeOnBackdrop?: boolean;

  /**
   * Optional accessible label for the close button.
   */
  closeButtonLabel?: string;
}

/**
 * Modal: A centered dialog with backdrop, close button, and actions.
 * Optionally closes when clicking outside (backdrop).
 * Actions can trigger custom callbacks.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  closeOnBackdrop = true,
  closeButtonLabel = "Close",
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.("cancel");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const defaultActions: ModalActionProps[] = actions?.length
    ? actions
    : [{ label: "Okay", variant: "primary" }];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.("cancel");
    }
  };

  return (
    <div className="nw-modal__backdrop" onClick={handleBackdropClick} role="presentation">
      <div className="nw-modal__container" role="dialog" aria-modal="true" ref={contentRef}>
        <div className="nw-modal__header">
          {title ? <div className="nw-modal__title">{title}</div> : null}
          <button
            type="button"
            className="nw-modal__close-button"
            aria-label={closeButtonLabel}
            onClick={() => onClose?.("cancel")}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {children ? <div className="nw-modal__content">{children}</div> : null}

        <div className="nw-modal__actions">
          {defaultActions.map((action, idx) => (
            <button
              key={idx}
              type="button"
              className={`nw-modal__action nw-modal__action--${action.variant ?? "secondary"}`}
              onClick={() => {
                action.onClick?.();
                onClose?.(action.id ?? action.label ?? "confirm");
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Modal;
