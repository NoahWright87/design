import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import { Header, Footer, Heading, Text, Button, Link, Card, Modal } from '../../src';

export default {
  title: 'Examples/Showcase',
  parameters: { layout: 'fullscreen' },
} as Meta;

export const Page = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, padding: '48px 24px', maxWidth: 980, margin: '0 auto' }}>
        <Heading level={1}>Design System — Showcase</Heading>
        <Text>
          This example page composes multiple components so you can see how they look together
          in a realistic layout.
        </Text>

        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <Button>Primary action</Button>
          <Button>Secondary</Button>
          <Link href="#">A contextual link</Link>
        </div>

        <section style={{ marginTop: 40 }}>
          <Heading level={2}>Cards for Content Grouping</Heading>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginTop: 16 }}>
            <Card title="Feature One" subtitle="Learn about this">
              Cards are great for grouping related content and creating visual hierarchy in layouts.
            </Card>
            <Card title="Feature Two" elevated>
              Use the elevated prop to make important cards stand out more.
            </Card>
            <Card title="Feature Three">
              Cards work well in grid layouts for organizing information clearly.
            </Card>
          </div>
        </section>

        <section style={{ marginTop: 40 }}>
          <Heading level={2}>Modal Interaction</Heading>
          <Text>
            Click the button below to open a modal dialog. Modals can be used for confirmations, 
            alerts, or complex interactions.
          </Text>
          <div style={{ marginTop: 12 }}>
            <Button onClick={() => setModalOpen(true)}>
              Open Modal Example
            </Button>
          </div>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Welcome to the Modal!"
            actions={[
              { label: "Got it", variant: "primary" },
              { label: "Learn more", variant: "secondary" },
            ]}
          >
            <Text>
              Modals provide focused interaction spaces. Click outside or press Escape to close,
              or use one of the action buttons above.
            </Text>
          </Modal>
        </section>

        <section style={{ marginTop: 40 }}>
          <Heading level={2}>Typography & Layout</Heading>
          <Text>
            More sample content to show how typography, spacing, and components interact within
            a realistic page layout.
          </Text>
        </section>
      </main>
      <Footer />
    </div>
  );
};
