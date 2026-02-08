import * as React from "react";
import "./input.css";

export type InputProps = {
  label: string;
  name?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  style?: React.CSSProperties;
};

export function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  defaultValue,
  onChange,
  error,
  disabled = false,
  required = false,
  style,
}: InputProps) {
  const classNames = [
    "nw-input",
    error && "nw-input--error",
    disabled && "nw-input--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classNames} style={style}>
      <span className="nw-input__label">
        {label}
        {required && <span className="nw-input__required">*</span>}
      </span>
      <input
        className="nw-input__field"
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        required={required}
      />
      {error && <span className="nw-input__error">{error}</span>}
    </label>
  );
}

export default Input;
