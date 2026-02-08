import * as React from "react";
import "./select.css";

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
  style,
}: SelectProps) {
  const classNames = [
    "nw-select",
    error && "nw-select--error",
    disabled && "nw-select--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classNames} style={style}>
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
        >
          {placeholder && (
            <option value="" disabled>
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
