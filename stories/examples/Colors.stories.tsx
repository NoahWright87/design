import React, { useEffect, useState } from 'react';
import { Meta } from '@storybook/react';
import { cssTokenNames } from '../../src/styles/tokens';

export default {
  title: 'Examples/Colors',
  parameters: { docs: { description: { story: 'Shows color tokens from theme.css' } } },
} as Meta;

export const ColorGrid = () => {
  const [colors, setColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement);
    const resolved: Record<string, string> = {};
    cssTokenNames.forEach((name) => {
      const value = computed.getPropertyValue(name).trim() || '(not set)';
      resolved[name] = value;
    });
    setColors(resolved);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Theme colors</h1>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {Object.entries(colors).map(([name, value]) => (
          <div key={name} style={{ width: 220, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ height: 120, background: value }} />
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 12, color: '#666' }}>{name}</div>
              <div style={{ marginTop: 6, fontFamily: 'monospace' }}>{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
