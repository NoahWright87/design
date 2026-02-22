import * as React from "react";
import "./checkbox.css";
import { pickRandomDisabledCursor } from "../_shared/randomDisabledCursor";
import { useWaggle } from "../_shared/useWaggle";

export type CheckboxProps = {
  label: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  disabled?: boolean;
  /** Show a randomly selected "no" emoji cursor when disabled. */
  randomDisabledCursor?: boolean;
  style?: React.CSSProperties;
};

export function Checkbox({
  label,
  name,
  checked,
  defaultChecked,
  onChange,
  error,
  disabled = false,
  randomDisabledCursor = false,
  style,
}: CheckboxProps) {
  const rootRef = React.useRef<HTMLLabelElement>(null);
  useWaggle(error, rootRef);

  const [disabledCursor] = React.useState<string>(
    () => (randomDisabledCursor && disabled) ? pickRandomDisabledCursor() : ""
  );

  const classNames = [
    "nw-checkbox",
    error && "nw-checkbox--error",
    disabled && "nw-checkbox--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  const rootStyle: React.CSSProperties = {
    ...(disabledCursor ? { cursor: disabledCursor } : {}),
    ...style,
  };

  return (
    <label ref={rootRef} className={classNames} style={rootStyle}>
      <input
        className="nw-checkbox__input"
        type="checkbox"
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={disabled}
        style={disabledCursor ? { cursor: "inherit" } : undefined}
      />
      <span className="nw-checkbox__box" aria-hidden="true" />
      <span className="nw-checkbox__label">{label}</span>
      {error && <span className="nw-checkbox__error">{error}</span>}
    </label>
  );
}

export default Checkbox;
