import * as React from "react";
import "./input.css";
import { pickRandomDisabledCursor } from "../_shared/randomDisabledCursor";
import { useWaggle } from "../_shared/useWaggle";

type InputOwnProps = {
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
  /** Render as a textarea for multi-line input. */
  multiline?: boolean;
  /** Number of visible text rows when `multiline` is true. */
  rows?: number;
  /** Show a randomly selected "no" emoji cursor when disabled. */
  randomDisabledCursor?: boolean;
  style?: React.CSSProperties;
};

/**
 * Native attributes (`spellCheck`, `autoComplete`, `inputMode`, `maxLength`, `onKeyDown`, …) that
 * pass straight through to the field. `className` stays with the design system's own classes, and
 * `children` / `dangerouslySetInnerHTML` are left out because a field can't hold content.
 */
type NativeFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof InputOwnProps | "className" | "children" | "dangerouslySetInnerHTML">;

export type InputProps = InputOwnProps & NativeFieldProps;

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(function Input({
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
  multiline = false,
  rows,
  randomDisabledCursor = false,
  style,
  onBlur,
  ...nativeProps
}, ref) {
  const rootRef = React.useRef<HTMLLabelElement>(null);
  const errorId = React.useId();
  const labelId = React.useId();

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const [touched, setTouched] = React.useState(false);

  const currentValue = isControlled ? value : internalValue;
  const requiredError = required && touched && !currentValue ? "This field is required." : undefined;
  const emailFormatError =
    type === "email" && touched && !!currentValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentValue)
      ? "Please enter a valid email address."
      : undefined;
  const effectiveError = error ?? requiredError ?? emailFormatError;

  useWaggle(effectiveError, rootRef);

  const [disabledCursor] = React.useState<string>(
    () => (randomDisabledCursor && disabled) ? pickRandomDisabledCursor() : ""
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setTouched(true);
    onBlur?.(e as React.FocusEvent<HTMLInputElement>);
  }

  const classNames = [
    "nw-input",
    effectiveError && "nw-input--error",
    disabled && "nw-input--disabled",
  ]
    .filter(Boolean)
    .join(" ");

  const rootStyle: React.CSSProperties = {
    ...(disabledCursor ? { cursor: disabledCursor } : {}),
    ...style,
  };

  const labelInner = (
    <span id={labelId} className="nw-input__label">
      {label}
      {required && <span className="nw-input__required" aria-hidden="true">*</span>}
    </span>
  );

  const errorEl = (
    <span id={errorId} className="nw-input__error" aria-live="polite">{effectiveError}</span>
  );

  if (multiline) {
    return (
      <label ref={rootRef} className={classNames} style={rootStyle}>
        {labelInner}
        <textarea
          {...(nativeProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          aria-labelledby={labelId}
          aria-invalid={!!effectiveError}
          aria-describedby={effectiveError ? errorId : undefined}
          className="nw-input__field nw-input__field--multiline"
          name={name}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value);
            onChange?.(e as unknown as React.ChangeEvent<HTMLInputElement>);
          }}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          rows={rows}
          style={disabledCursor ? { cursor: "inherit" } : undefined}
        />
        {errorEl}
      </label>
    );
  }

  return (
    <label ref={rootRef} className={classNames} style={rootStyle}>
      {labelInner}
      <input
        {...nativeProps}
        ref={ref as React.Ref<HTMLInputElement>}
        aria-labelledby={labelId}
        aria-invalid={!!effectiveError}
        aria-describedby={effectiveError ? errorId : undefined}
        className="nw-input__field"
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
        style={disabledCursor ? { cursor: "inherit" } : undefined}
      />
      {errorEl}
    </label>
  );
});

export default Input;
