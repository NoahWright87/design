import * as React from "react";
import "./radiogroup.css";

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
  disabled?: boolean;
  style?: React.CSSProperties;
};

export function RadioGroup({
  label,
  name,
  options,
  value,
  defaultValue,
  onChange,
  disabled = false,
  style,
}: RadioGroupProps) {
  const classNames = [
    "nw-radio-group",
    disabled && "nw-radio-group--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <fieldset className={classNames} style={style}>
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
            <label key={option.value} className={optionClassNames}>
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
                onChange={onChange}
                disabled={optionDisabled}
              />
              <span className="nw-radio__circle" aria-hidden="true" />
              <span className="nw-radio__label">{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default RadioGroup;
