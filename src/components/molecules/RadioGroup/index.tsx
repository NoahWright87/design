import * as React from "react";
import "./radiogroup.css";
import { pickRandomDisabledCursor } from "../_shared/randomDisabledCursor";
import { useWaggle } from "../_shared/useWaggle";

export type RadioOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type RadioGroupProps = {
  label: string;
  name: string;
  options: RadioOption[];
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

export function RadioGroup({
  label,
  name,
  options,
  value,
  defaultValue,
  onChange,
  error,
  disabled = false,
  required = false,
  randomDisabledCursor = false,
  style,
}: RadioGroupProps) {
  const rootRef = React.useRef<HTMLFieldSetElement>(null);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const [touched, setTouched] = React.useState(false);

  const currentValue = isControlled ? value : internalValue;
  const requiredError = required && touched && !currentValue ? "Please select an option." : undefined;
  const effectiveError = error ?? requiredError;

  useWaggle(effectiveError, rootRef);

  const [disabledCursor] = React.useState<string>(
    () => (randomDisabledCursor && disabled) ? pickRandomDisabledCursor() : ""
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternalValue(e.target.value);
    setTouched(true);
    onChange?.(e);
  }

  const classNames = [
    "nw-radio-group",
    effectiveError && "nw-radio-group--error",
    disabled && "nw-radio-group--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  const rootStyle: React.CSSProperties = {
    ...(disabledCursor ? { cursor: disabledCursor } : {}),
    ...style,
  };

  return (
    <fieldset ref={rootRef} className={classNames} style={rootStyle}>
      <legend className="nw-radio-group__legend">{label}</legend>
      <div className="nw-radio-group__options">
        {options.map((option) => {
          const optionDisabled = disabled || option.disabled;
          const optionClassNames = [
            "nw-radio",
            optionDisabled && "nw-radio--disabled",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <label
              key={option.value}
              className={optionClassNames}
              style={disabledCursor && optionDisabled ? { cursor: "inherit" } : undefined}
            >
              <input
                className="nw-radio__input"
                type="radio"
                name={name}
                value={option.value}
                checked={value !== undefined ? value === option.value : undefined}
                defaultChecked={
                  defaultValue !== undefined
                    ? defaultValue === option.value
                    : undefined
                }
                onChange={handleChange}
                disabled={optionDisabled}
                style={disabledCursor && optionDisabled ? { cursor: "inherit" } : undefined}
              />
              <span className="nw-radio__circle" aria-hidden="true" />
              <span className="nw-radio__label">{option.label}</span>
            </label>
          );
        })}
      </div>
      <span className="nw-radio-group__error" aria-live="polite">{effectiveError}</span>
    </fieldset>
  );
}

export default RadioGroup;
