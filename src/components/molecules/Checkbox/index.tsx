import * as React from "react";
import "./checkbox.css";

export type CheckboxProps = {
  label: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  style?: React.CSSProperties;
};

export function Checkbox({
  label,
  name,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  style,
}: CheckboxProps) {
  const classNames = [
    "nw-checkbox",
    disabled && "nw-checkbox--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classNames} style={style}>
      <input
        className="nw-checkbox__input"
        type="checkbox"
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="nw-checkbox__box" aria-hidden="true" />
      <span className="nw-checkbox__label">{label}</span>
    </label>
  );
}

export default Checkbox;
