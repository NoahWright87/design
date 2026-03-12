import * as React from "react";
import styles from "./GeneratedCss.module.css";

export interface GeneratedCssProps {
  cssText: string;
}

export function GeneratedCss({ cssText }: GeneratedCssProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cssText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={styles.gen}>
      <div className={styles.gen__top}>
        <div className={styles.gen__hint}>
          Portable CSS snippet based on current settings
        </div>
        <button className={styles.gen__copy} type="button" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy CSS"}
        </button>
      </div>
      <textarea
        className={styles.gen__box}
        value={cssText}
        readOnly
        rows={16}
        spellCheck={false}
      />
    </div>
  );
}
