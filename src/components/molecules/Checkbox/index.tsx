import * as React from "react";
import "./checkbox.css";
import { pickRandomDisabledCursor } from "../_shared/randomDisabledCursor";

export type CheckboxProps = {
  label: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
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
  disabled = false,
  randomDisabledCursor = false,
  style,
}: CheckboxProps) {
  const [disabledCursor] = React.useState<string>(
    () => (randomDisabledCursor && disabled) ? pickRandomDisabledCursor() : ""
  );

  const classNames = [
    "nw-checkbox",
    disabled && "nw-checkbox--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  const rootStyle: React.CSSProperties = {
    ...(disabledCursor ? { cursor: disabledCursor } : {}),
    ...style,
  };

  return (
    <label className={classNames} style={rootStyle}>
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
    </label>
  );
}

export default Checkbox;
