import * as React from "react";
import "./select.css";
import { pickRandomDisabledCursor } from "../_shared/randomDisabledCursor";
import { useWaggle } from "../_shared/useWaggle";

export type SelectProps = {
  label: string;
  name?: string;
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  /** Show a randomly selected "no" emoji cursor when disabled. */
  randomDisabledCursor?: boolean;
  style?: React.CSSProperties;
};

export function Select({
  label,
  name,
  children,
  value,
  defaultValue,
  onChange,
  error,
  disabled = false,
  required = false,
  placeholder,
  randomDisabledCursor = false,
  style,
}: SelectProps) {
  const rootRef = React.useRef<HTMLLabelElement>(null);
  useWaggle(error, rootRef);

  const [disabledCursor] = React.useState<string>(
    () => (randomDisabledCursor && disabled) ? pickRandomDisabledCursor() : ""
  );

  const classNames = [
    "nw-select",
    error && "nw-select--error",
    disabled && "nw-select--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  const rootStyle: React.CSSProperties = {
    ...(disabledCursor ? { cursor: disabledCursor } : {}),
    ...style,
  };

  return (
    <label ref={rootRef} className={classNames} style={rootStyle}>
      <span className="nw-select__label">
        {label}
        {required && <span className="nw-select__required">*</span>}
      </span>
      <div className="nw-select__wrapper">
        <select
          className="nw-select__field"
          name={name}
          value={value}
          defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
          onChange={onChange}
          disabled={disabled}
          required={required}
          style={disabledCursor ? { cursor: "inherit" } : undefined}
        >
          {placeholder && (
            <option value="">
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <span className="nw-select__arrow" aria-hidden="true">
          &#9662;
        </span>
      </div>
      {error && <span className="nw-select__error">{error}</span>}
    </label>
  );
}

export default Select;
