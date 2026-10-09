import React, { useEffect, useRef, useState } from 'react';
import { Meta } from '@storybook/react';
import { Header, Footer, Heading, Text, Button, Link, Card, CardGrid, Modal, Input, Select, Checkbox, RadioGroup } from '../../src';

export default {
  title: 'Examples/Showcase',
  parameters: { layout: 'fullscreen' },
} as Meta;

export const Page = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const previousTitle = document.title;
    const existing = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const description = existing ?? document.createElement('meta');
    const previousDescription = description.content;
    description.name = 'description';
    description.content = 'Studio projects, contact details, and delivery information.';
    document.title = 'Studio - Design System Showcase';
    if (!existing) document.head.appendChild(description);
    return () => {
      document.title = previousTitle;
      if (existing) description.content = previousDescription;
      else description.remove();
    };
  }, []);

  useEffect(() => {
    if (!modalOpen || typeof document === 'undefined') return;
    const dialog = rootRef.current?.querySelector<HTMLElement>('[role="dialog"]');
    if (!dialog) return;
    dialog.setAttribute('aria-label', 'Project confirmation');
    dialog.querySelector<HTMLButtonElement>('button')?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const buttons = dialog.querySelectorAll<HTMLButtonElement>('button');
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', trapFocus);
    return () => { document.removeEventListener('keydown', trapFocus); openerRef.current?.focus(); };
  }, [modalOpen]);

  return (
    <div ref={rootRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <a href="#showcase-main" onClick={() => rootRef.current?.querySelector<HTMLElement>('main')?.focus()}>Skip to content</a>
      <Header center={<nav aria-label="Page sections" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>{['Projects', 'Contact', 'Address', 'Confirmation'].map(name => <Link key={name} href={`#${name.toLowerCase()}`}>{name}</Link>)}</nav>} />
      <main id="showcase-main" tabIndex={-1} style={{ flex: 1, padding: '32px 24px', maxWidth: 980, width: '100%', margin: '0 auto' }}>
        <Heading level={1}>Studio</Heading>
        <Text>
          Software, visual design, and independent projects.
        </Text>

        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <Link href="#contact">Discuss a project</Link>
          <Link href="#projects">View our work</Link>
        </div>

        <section id="projects" style={{ marginTop: 40, scrollMarginTop: 100 }}>
          <Heading level={2} animateIn>Projects</Heading>
          <CardGrid minCardWidth="240px" gap="lg">
            <Card title="Field Notes" subtitle="Editorial design">
              A journal for independent makers and their creative process.
            </Card>
            <Card title="Open Studio" elevated>
              A shared workspace for planning, prototyping, and collaboration.
            </Card>
            <Card title="Small Hours">
              A collection of thoughtful tools for everyday work.
            </Card>
          </CardGrid>
        </section>

        <section id="contact" style={{ marginTop: 40, scrollMarginTop: 100 }}>
          <Heading level={2}>Contact</Heading>
          <ExampleForm kind="contact" />
        </section>
        <section id="address" style={{ marginTop: 40, scrollMarginTop: 100 }}>
          <Heading level={2}>Delivery address</Heading>
          <ExampleForm kind="address" />
        </section>

        <section id="confirmation" style={{ marginTop: 40, scrollMarginTop: 100 }}>
          <Heading level={2}>Confirmation</Heading>
          <Text>
            Review your project details before continuing.
          </Text>
          <div style={{ marginTop: 12 }}>
            <Button onClick={(event) => { openerRef.current = event.currentTarget; setModalOpen(true); }}>
              Open Modal Example
            </Button>
          </div>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Project confirmation"
            actions={[
              { label: "Got it", variant: "primary" },
              { label: "Learn more", variant: "secondary" },
            ]}
          >
            <Text>
              Your project details are ready for review.
            </Text>
          </Modal>
        </section>

        <section style={{ marginTop: 40 }}>
          <Heading level={2}>Our approach</Heading>
          <Text>
            We build clear, useful experiences through close collaboration and careful iteration.
          </Text>
        </section>
      </main>
      <Footer />
    </div>
  );
};

function ExampleForm({ kind }: { kind: 'contact' | 'address' }) {
  const fields = kind === 'contact' ? ['Full name', 'Email'] : ['Street', 'City', 'Postal code'];
  const choice = kind === 'contact' ? 'Reason' : 'Country';
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const update = (name: string, value: string) => {
    setValues(previous => ({ ...previous, [name]: value }));
    setErrors(previous => ({ ...previous, [name]: '' }));
    setSuccess(false);
  };

  return (
    <form ref={formRef} aria-label={`${kind} form`} noValidate style={{ display: 'grid', gap: 16, marginTop: 16 }} onSubmit={(event) => {
      event.preventDefault();
      const next: Record<string, string> = {};
      [...fields, choice].forEach(name => { if (!values[name]?.trim()) next[name] = 'This field is required.'; });
      if (kind === 'contact') {
        if (values.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.Email)) next.Email = 'Enter a valid email address.';
        if (!consent) next.consent = 'Consent is required.';
      }
      setErrors(next);
      setSuccess(Object.keys(next).length === 0);
      if (Object.keys(next).length && typeof window !== 'undefined') window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
    }}>
      {fields.map(name => <Input key={name} label={name} name={`${kind}-${name}`} type={name === 'Email' ? 'email' : 'text'} required value={values[name] ?? ''} error={errors[name]} onChange={event => update(name, event.target.value)} />)}
      <Select label={choice} name={`${kind}-choice`} required value={values[choice] ?? ''} error={errors[choice]} onChange={event => update(choice, event.target.value)}>
        <option value="">Select one</option>
        {(kind === 'contact' ? ['Project inquiry', 'Support'] : ['United States', 'Canada', 'United Kingdom']).map(name => <option key={name} value={name}>{name}</option>)}
      </Select>
      {kind === 'contact' && <>
        <RadioGroup label="Response preference" name="response-preference" defaultValue="email" options={[{ label: 'Email', value: 'email' }, { label: 'Phone', value: 'phone' }]} />
        <Checkbox label="I consent to being contacted" checked={consent} required error={errors.consent} onChange={event => { setConsent(event.target.checked); setErrors(previous => ({ ...previous, consent: '' })); setSuccess(false); }} />
      </>}
      <div style={{ display: 'flex', gap: 12 }}>
        <Button type="submit">{kind === 'contact' ? 'Send message' : 'Save address'}</Button>
        <Button variant="ghost" onClick={() => { setValues({}); setConsent(false); setErrors({}); setSuccess(false); formRef.current?.reset(); }}>Reset {kind}</Button>
      </div>
      <p role="status" style={{ minHeight: '1.5em', margin: 0, color: 'var(--confirm)' }}>{success ? (kind === 'contact' ? 'Message ready. Local preview only.' : 'Address saved for this preview.') : ''}</p>
    </form>
  );
}
