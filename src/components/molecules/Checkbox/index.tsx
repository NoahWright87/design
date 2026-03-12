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
  required?: boolean;
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
  required = false,
  randomDisabledCursor = false,
  style,
}: CheckboxProps) {
  const rootRef = React.useRef<HTMLLabelElement>(null);

  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
  const [touched, setTouched] = React.useState(false);

  const currentChecked = isControlled ? checked : internalChecked;
  const requiredError = required && touched && !currentChecked ? "This field is required." : undefined;
  const effectiveError = error ?? requiredError;

  useWaggle(effectiveError, rootRef);

  const [disabledCursor] = React.useState<string>(
    () => (randomDisabledCursor && disabled) ? pickRandomDisabledCursor() : ""
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternalChecked(e.target.checked);
    setTouched(true);
    onChange?.(e);
  }

  const classNames = [
    "nw-checkbox",
    effectiveError && "nw-checkbox--error",
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
        onChange={handleChange}
        disabled={disabled}
        style={disabledCursor ? { cursor: "inherit" } : undefined}
      />
      <span className="nw-checkbox__box" aria-hidden="true" />
      <span className="nw-checkbox__label">{label}</span>
      <span className="nw-checkbox__error" aria-live="polite">{effectiveError}</span>
    </label>
  );
}

export default Checkbox;
