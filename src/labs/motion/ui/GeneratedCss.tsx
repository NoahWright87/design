import * as React from "react";
import styles from "./GeneratedCss.module.css";

export interface GeneratedCssProps {
  cssText: string;
  /** Export as CSS custom properties in a :root {} block. */
  cssVarsText?: string;
  /** Export as SCSS variables ($var: value !default). */
  scssText?: string;
  /** Export as design token JSON (W3C flat format). */
  jsonText?: string;
}

type TabId = "css" | "vars" | "scss" | "json";

interface Tab {
  id: TabId;
  label: string;
  content: string;
  hint: string;
}

export function GeneratedCss({ cssText, cssVarsText, scssText, jsonText }: GeneratedCssProps) {
  const tabs: Tab[] = [
    { id: "css",  label: "Class CSS", content: cssText,           hint: "Portable CSS snippet based on current settings" },
    ...(cssVarsText ? [{ id: "vars" as TabId, label: "CSS Vars", content: cssVarsText, hint: "Paste into :root to use as design tokens" }] : []),
    ...(scssText    ? [{ id: "scss" as TabId, label: "SCSS",     content: scssText,   hint: "SCSS variables with !default — paste into your variables file" }] : []),
    ...(jsonText    ? [{ id: "json" as TabId, label: "JSON",     content: jsonText,   hint: "Design token JSON (W3C format) for Token Studio and similar tools" }] : []),
  ];

  const [activeTab, setActiveTab] = React.useState<TabId>("css");
  const [copied, setCopied] = React.useState(false);

  const active = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(active.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const showTabs = tabs.length > 1;

  return (
    <div className={styles.gen}>
      {showTabs && (
        <div className={styles.gen__tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={[styles.gen__tab, activeTab === tab.id ? styles["gen__tab--active"] : ""].filter(Boolean).join(" ")}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      <div className={styles.gen__top}>
        <div className={styles.gen__hint}>{active.hint}</div>
        <button className={styles.gen__copy} type="button" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <textarea
        className={styles.gen__box}
        value={active.content}
        readOnly
        rows={16}
        spellCheck={false}
      />
    </div>
  );
}
