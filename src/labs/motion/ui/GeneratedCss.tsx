import * as React from "react";
import styles from "./GeneratedCss.module.css";

export interface GeneratedCssProps {
  cssText: string;
}

type ExportFormat = "css" | "root" | "scss" | "json";

const formatLabels: Record<ExportFormat, string> = {
  css: "Component CSS",
  root: ":root custom properties",
  scss: "SCSS variables",
  json: "Design token JSON",
};

function extractCustomProperties(cssText: string) {
  return Array.from(cssText.matchAll(/(--[\w-]+):\s*([^;]+);/g)).map((match) => ({
    name: match[1],
    value: match[2].trim(),
  }));
}

function formatExport(cssText: string, format: ExportFormat) {
  const tokens = extractCustomProperties(cssText);

  if (format === "root") {
    return `:root {\n${tokens.map((token) => `  ${token.name}: ${token.value};`).join("\n")}\n}`;
  }

  if (format === "scss") {
    return tokens
      .map((token) => `$${token.name.slice(2)}: ${token.value} !default;`)
      .join("\n");
  }

  if (format === "json") {
    const payload = Object.fromEntries(
      tokens.map((token) => [token.name.slice(2), { value: token.value, type: "motion" }]),
    );
    return JSON.stringify(payload, null, 2);
  }

  return cssText;
}

export function GeneratedCss({ cssText }: GeneratedCssProps) {
  const [copied, setCopied] = React.useState(false);
  const [format, setFormat] = React.useState<ExportFormat>("css");
  const exportText = React.useMemo(() => formatExport(cssText, format), [cssText, format]);

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={styles.gen}>
      <div className={styles.gen__top}>
        <label className={styles.gen__hint}>
          Export format
          <select
            className={styles.gen__select}
            value={format}
            onChange={(event) => setFormat(event.target.value as ExportFormat)}
          >
            {Object.entries(formatLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <button className={styles.gen__copy} type="button" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy export"}
        </button>
      </div>
      <textarea
        className={styles.gen__box}
        value={exportText}
        readOnly
        rows={16}
        spellCheck={false}
      />
    </div>
  );
}
