import * as React from "react";
import "./input.css";
import { pickRandomDisabledCursor } from "../_shared/randomDisabledCursor";
import { useWaggle } from "../_shared/useWaggle";

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
  /** Show a randomly selected "no" emoji cursor when disabled. */
  randomDisabledCursor?: boolean;
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
  randomDisabledCursor = false,
  style,
}: InputProps) {
  const rootRef = React.useRef<HTMLLabelElement>(null);
  useWaggle(error, rootRef);

  const [disabledCursor] = React.useState<string>(
    () => (randomDisabledCursor && disabled) ? pickRandomDisabledCursor() : ""
  );

  const classNames = [
    "nw-input",
    error && "nw-input--error",
    disabled && "nw-input--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  const rootStyle: React.CSSProperties = {
    ...(disabledCursor ? { cursor: disabledCursor } : {}),
    ...style,
  };

  return (
    <label ref={rootRef} className={classNames} style={rootStyle}>
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
        style={disabledCursor ? { cursor: "inherit" } : undefined}
      />
      {error && <span className="nw-input__error">{error}</span>}
    </label>
  );
}

export default Input;
