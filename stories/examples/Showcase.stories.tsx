import React from 'react';
import { Meta } from '@storybook/react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { Heading } from '../../src/components/Heading';
import { Text } from '../../src/components/Text';
import { Button } from '../../src/components/Button';
import { Link } from '../../src/components/Link';

export default {
  title: 'Examples/Showcase',
  parameters: { layout: 'fullscreen' },
} as Meta;

export const Page = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Header />
    <main style={{ flex: 1, padding: '48px 24px', maxWidth: 980, margin: '0 auto' }}>
      <Heading level={1}>Design System — Showcase</Heading>
      <Text>
        This example page composes multiple components so you can see how they look together
        in a realistic layout.
      </Text>

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <Button>Primary action</Button>
        <Button>Secondary</Button>
        <Link href="#">A contextual link</Link>
      </div>

      <section style={{ marginTop: 40 }}>
        <Heading level={2}>Section Preview</Heading>
        <Text>
          More sample content to show typography, spacing, and how components interact within
          a page layout.
        </Text>
      </section>
    </main>
    <Footer />
  </div>
);
