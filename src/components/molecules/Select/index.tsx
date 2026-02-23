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
  /**
   * When set, renders the select as a scrollable listbox showing this many
   * options at once. Useful for long option lists. Hides the dropdown arrow.
   */
  maxVisibleItems?: number;
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
  maxVisibleItems,
}: SelectProps) {
  const rootRef = React.useRef<HTMLLabelElement>(null);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? (placeholder ? "" : ""));
  const [touched, setTouched] = React.useState(false);

  const currentValue = isControlled ? value : internalValue;
  const requiredError = required && touched && !currentValue ? "Please select an option." : undefined;
  const effectiveError = error ?? requiredError;

  useWaggle(effectiveError, rootRef);

  const [disabledCursor] = React.useState<string>(
    () => (randomDisabledCursor && disabled) ? pickRandomDisabledCursor() : ""
  );

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  }

  function handleBlur() {
    setTouched(true);
  }

  const classNames = [
    "nw-select",
    effectiveError && "nw-select--error",
    disabled && "nw-select--disabled",
    maxVisibleItems && "nw-select--listbox",
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
        {/* Arrow hidden in listbox mode via CSS */}
        <select
          className="nw-select__field"
          name={name}
          value={value}
          defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          size={maxVisibleItems}
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
      <span className="nw-select__error" aria-live="polite">{effectiveError}</span>
    </label>
  );
}

export default Select;
