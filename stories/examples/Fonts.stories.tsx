import React, { useEffect, useState } from 'react';
import type { Meta } from '@storybook/react';
import { fontFamilyTokens } from '../../src/styles/tokens';

export default {
  title: 'Examples/Fonts',
  parameters: {
    docs: { description: { component: 'Font roles from theme.css and specimens of each typeface bundled with the design system.' } },
  },
} as Meta;

/**
 * Typefaces bundled with the design system. To add a font, ship its file in
 * `src/styles/fonts/`, declare it with `@font-face` in `theme.css`, and add an entry here.
 */
const typefaces = [
  {
    family: 'Wright Sans',
    role: 'Headings',
    token: '--font-family-heading',
    weights: 'One weight, used as drawn at every heading weight',
    description:
      'Geometric sans with restrained chamfered terminals and legibility-first numerals. Characters outside basic Latin (such as accented letters) fall back to the body font.',
  },
];

const roleLabels: Record<(typeof fontFamilyTokens)[number], string> = {
  '--font-family': 'Body',
  '--font-family-heading': 'Headings',
  '--font-family-mono': 'Code',
};

const pangram = 'The quick brown fox jumps over the lazy dog.';
const characterRows = [
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'abcdefghijklmnopqrstuvwxyz',
  '0123456789',
  '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~',
  '° ± × ÷ – — ‘ ’ “ ” • … −',
];
const sizeRamp = ['--text-xs', '--text-sm', '--text-md', '--text-lg', '--text-xl'];
const displaySizes = ['2rem', '3rem', '4.5rem'];

const muted = 'color-mix(in srgb, var(--foreground) 60%, transparent)';
const border = '1px solid color-mix(in srgb, var(--foreground) 12%, transparent)';
const labelStyle: React.CSSProperties = {
  fontSize: 'var(--text-xs)',
  color: muted,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};
const codeStyle: React.CSSProperties = { fontFamily: 'var(--font-family-mono)', fontSize: 'var(--text-sm)' };

export const Roles = () => {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement);
    const resolved: Record<string, string> = {};
    fontFamilyTokens.forEach((name) => {
      resolved[name] = computed.getPropertyValue(name).trim() || '(not set)';
    });
    setValues(resolved);
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 960 }}>
      <h1>Font roles</h1>
      <p style={{ color: muted }}>
        Each role is a theme token. Sites override a role by setting the token (or the matching <code>Theme</code> field).
      </p>
      <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
        {fontFamilyTokens.map((name) => (
          <section key={name} style={{ border, borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <span style={labelStyle}>{roleLabels[name]}</span>
              <code style={codeStyle}>{name}</code>
            </div>
            <div style={{ fontFamily: `var(${name})`, fontSize: '1.75rem', margin: '12px 0 4px' }}>{pangram}</div>
            <div style={{ fontFamily: `var(${name})`, fontSize: 'var(--text-md)' }}>{characterRows[2]} {characterRows[1]}</div>
            <div style={{ ...codeStyle, color: muted, marginTop: 12, overflowWrap: 'anywhere' }}>{values[name] ?? ''}</div>
          </section>
        ))}
      </div>
    </div>
  );
};

export const Typefaces = () => (
  <div style={{ padding: 24, maxWidth: 960 }}>
    <h1>Typefaces</h1>
    <p style={{ color: muted }}>Fonts bundled with the design system, shown in full.</p>
    {typefaces.map((face) => {
      const family = `"${face.family}", var(--font-family)`;
      return (
        <section key={face.family} style={{ borderTop: border, marginTop: 32, paddingTop: 24 }}>
          <div style={{ fontFamily: family, fontSize: 'clamp(2.5rem, 12vw, 4rem)', lineHeight: 1.1, overflowWrap: 'anywhere' }}>{face.family}</div>
          <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '6px 16px', margin: '16px 0' }}>
            <dt style={labelStyle}>Role</dt>
            <dd style={{ margin: 0 }}>{face.role} (<code style={codeStyle}>{face.token}</code>)</dd>
            <dt style={labelStyle}>Weights</dt>
            <dd style={{ margin: 0 }}>{face.weights}</dd>
            <dt style={labelStyle}>Notes</dt>
            <dd style={{ margin: 0 }}>{face.description}</dd>
          </dl>

          <div style={{ ...labelStyle, marginTop: 24 }}>Characters</div>
          <div style={{ fontFamily: family, fontSize: '2rem', lineHeight: 1.5, overflowWrap: 'anywhere' }}>
            {characterRows.map((row) => (
              <div key={row}>{row}</div>
            ))}
          </div>

          <div style={{ ...labelStyle, marginTop: 24 }}>Display sizes</div>
          {displaySizes.map((size) => (
            <div key={size} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 16 }}>
              <code style={{ ...codeStyle, color: muted, minWidth: 64 }}>{size}</code>
              <span style={{ fontFamily: family, fontSize: size, lineHeight: 1.2, minWidth: 0, overflowWrap: 'anywhere' }}>Software builder</span>
            </div>
          ))}

          <div style={{ ...labelStyle, marginTop: 24 }}>Type scale</div>
          {sizeRamp.map((token) => (
            <div key={token} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 16 }}>
              <code style={{ ...codeStyle, color: muted, minWidth: 96 }}>{token}</code>
              <span style={{ fontFamily: family, fontSize: `var(${token})` }}>{pangram}</span>
            </div>
          ))}

          <div style={{ ...labelStyle, marginTop: 24 }}>In context</div>
          <h2 style={{ fontFamily: family, marginBottom: 4 }}>Projects &amp; writing, 2026</h2>
          <p style={{ marginTop: 0 }}>
            Body copy stays in the body font so long passages remain easy to read, while headings carry the personality.
          </p>
        </section>
      );
    })}
  </div>
);
