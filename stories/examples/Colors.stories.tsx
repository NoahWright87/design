import React, { useEffect, useState } from 'react';
import { Meta } from '@storybook/react';
import { cssTokenNames } from '../../src/styles/tokens';

export default {
  title: 'Examples/Colors',
  parameters: { docs: { description: { story: 'Shows color tokens from theme.css' } } },
} as Meta;

export const ColorGrid = () => {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement);
    const resolved: Record<string, string> = {};
    cssTokenNames.forEach((name) => {
      const value = computed.getPropertyValue(name).trim() || '(not set)';
      resolved[name] = value;
    });
    setColors(resolved);
  }, []);

  function handleCopy(name: string) {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(name);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Theme colors</h1>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {Object.entries(colors).map(([name, value]) => {
          const isCopied = copied === name;
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
                border: '1px solid #eee',
                borderRadius: 8,
                overflow: 'hidden',
                cursor: 'pointer',
                outline: isCopied ? '2px solid var(--primary, #2563eb)' : undefined,
                transition: 'outline 0.15s',
                background: 'var(--background)',
              }}
            >
              <div style={{ height: 120, background: value }} />
              <div style={{ padding: 12 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: isCopied ? 'var(--primary, #2563eb)' : '#666',
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
