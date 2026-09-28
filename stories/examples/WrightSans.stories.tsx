import React from 'react';
import { Meta } from '@storybook/react';

export default {
  title: 'Examples/Wright Sans',
  parameters: {
    docs: { description: { story: 'Specimen for the Wright Sans heading typeface (all four weights).' } },
  },
} as Meta;

const weights = [
  { name: 'Regular', value: 400 },
  { name: 'SemiBold', value: 600 },
  { name: 'Bold', value: 700 },
  { name: 'Black', value: 900 },
];

const sets = [
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'abcdefghijklmnopqrstuvwxyz',
  '0123456789',
  `.,:;!?@#&%+-/\\()[]{}'"_=*$ <|^~> “” ‘’ – — … ¡¿`,
  'ÀÁÃÄÇÈÉËÌÍÏÑÒÓÕÖÙÚÜÝŸ àáãäçèéëìíïñòóõöùúüýÿ',
];

const family = 'var(--font-heading)';

export const Specimen = () => (
  <div style={{ padding: 24, color: 'var(--foreground)', background: 'var(--background)' }}>
    {weights.map((w) => (
      <section key={w.name} style={{ marginBottom: 48 }}>
        <div style={{ fontFamily: family, fontWeight: w.value, fontSize: 64, lineHeight: 1.1 }}>
          Wright Sans – {w.name}
        </div>
        {sets.map((s) => (
          <div key={s} style={{ fontFamily: family, fontWeight: w.value, fontSize: 32, lineHeight: 1.4 }}>
            {s}
          </div>
        ))}
      </section>
    ))}
  </div>
);

export const Headings = () => (
  <div style={{ padding: 24, color: 'var(--foreground)', background: 'var(--background)' }}>
    <h1 style={{ fontFamily: family, fontWeight: 900, fontSize: 56, margin: '0 0 8px' }}>Build in public</h1>
    <h2 style={{ fontFamily: family, fontWeight: 700, fontSize: 40, margin: '0 0 8px' }}>Projects &amp; experiments</h2>
    <h3 style={{ fontFamily: family, fontWeight: 600, fontSize: 28, margin: '0 0 8px' }}>Typography that means business</h3>
    <h4 style={{ fontFamily: family, fontWeight: 400, fontSize: 22, margin: '0 0 16px' }}>
      The quick brown fox jumps over the lazy dog
    </h4>
    <p style={{ maxWidth: 560 }}>
      Wright Sans is a display face intended for headings. Body copy keeps the system font; pair a Wright Sans heading
      with regular paragraph text like this one.
    </p>
  </div>
);
