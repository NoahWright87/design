import React, { useEffect, useMemo, useState } from 'react';
import { Meta } from '@storybook/react';
import { cssTokenNames } from '../../src/styles/tokens';

export default {
  title: 'Examples/Colors',
  parameters: { docs: { description: { story: 'Shows color tokens from theme.css' } } },
} as Meta;

type Rgb = { r: number; g: number; b: number };

function parseRgb(value: string): Rgb | null {
  const rgbMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);

  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
    };
  }

  if (value.startsWith('#') && value.length === 7) {
    return {
      r: Number.parseInt(value.slice(1, 3), 16),
      g: Number.parseInt(value.slice(3, 5), 16),
      b: Number.parseInt(value.slice(5, 7), 16),
    };
  }

  return null;
}

function luminance({ r, g, b }: Rgb) {
  const channels = [r, g, b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(a: string, b: string) {
  const first = parseRgb(a);
  const second = parseRgb(b);

  if (!first || !second) {
    return null;
  }

  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function formatContrast(ratio: number | null) {
  return ratio ? `${ratio.toFixed(2)}:1` : 'n/a';
}

function formatCssVariables(colors: Record<string, string>) {
  const lines = Object.entries(colors).map(([name, value]) => `  ${name}: ${value};`);
  return `:root {\n${lines.join('\n')}\n}`;
}

function formatJson(colors: Record<string, string>) {
  return JSON.stringify(colors, null, 2);
}

export const ColorGrid = () => {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'css' | 'json'>('css');

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement);
    const resolved: Record<string, string> = {};
    cssTokenNames.forEach((name) => {
      const value = computed.getPropertyValue(name).trim() || '(not set)';
      resolved[name] = value;
    });
    setColors(resolved);
  }, []);

  const exportText = useMemo(
    () => exportFormat === 'css' ? formatCssVariables(colors) : formatJson(colors),
    [colors, exportFormat],
  );

  function handleCopy(name: string) {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    navigator.clipboard.writeText(name).then(() => {
      setCopied(name);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  function handleExportCopy() {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    navigator.clipboard.writeText(exportText).then(() => {
      setCopied('export');
      setTimeout(() => setCopied(null), 1500);
    });
  }

  const foreground = colors['--foreground'];
  const background = colors['--background'];

  return (
    <div style={{ padding: 24 }}>
      <h1>Theme colors</h1>
      <section style={{ marginBottom: 24 }}>
        <h2>Export values</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <label>
            Format{' '}
            <select
              value={exportFormat}
              onChange={(event) => setExportFormat(event.target.value as 'css' | 'json')}
            >
              <option value="css">CSS custom properties</option>
              <option value="json">JSON</option>
            </select>
          </label>
          <button type="button" onClick={handleExportCopy}>
            {copied === 'export' ? 'Copied export!' : 'Copy export'}
          </button>
        </div>
        <textarea
          value={exportText}
          readOnly
          rows={8}
          spellCheck={false}
          style={{
            width: '100%',
            marginTop: 12,
            border: '1px solid var(--overlay)',
            borderRadius: 8,
            background: 'var(--background)',
            color: 'var(--foreground)',
            fontFamily: 'monospace',
          }}
        />
      </section>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {Object.entries(colors).map(([name, value]) => {
          const isCopied = copied === name;
          const foregroundContrast = contrastRatio(value, foreground);
          const backgroundContrast = contrastRatio(value, background);
          return (
            <button
              type="button"
              key={name}
              title={isCopied ? 'Copied!' : `Click to copy ${name}`}
              onClick={() => handleCopy(name)}
              onKeyDown={(e) => {
                if (e.key === ' ') {
                  e.preventDefault();
                }
              }}
              style={{
                width: 220,
                display: 'block',
                textAlign: 'left',
                border: '1px solid var(--overlay)',
                borderRadius: 8,
                overflow: 'hidden',
                cursor: 'pointer',
                outline: isCopied ? '2px solid var(--primary)' : undefined,
                transition: 'outline 0.15s',
                background: 'var(--background)',
              }}
            >
              <div
                style={{
                  minHeight: 120,
                  background: value,
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 8,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    padding: 8,
                    borderRadius: 6,
                    background: 'var(--overlay)',
                    color: 'var(--background)',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <div>vs foreground: {formatContrast(foregroundContrast)}</div>
                  <div>vs background: {formatContrast(backgroundContrast)}</div>
                </div>
              </div>
              <div style={{ padding: 12 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: isCopied ? 'var(--primary)' : 'var(--secondary)',
                    fontWeight: isCopied ? 600 : undefined,
                    transition: 'color 0.15s',
                  }}
                >
                  {isCopied ? '✓ Copied!' : name}
                </div>
                <div style={{ marginTop: 6, fontFamily: 'monospace' }}>{value}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
