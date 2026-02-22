import React from "react";
import { Meta } from "@storybook/react";
import {
  Header,
  Footer,
  Heading,
  Text,
  Card,
  Button,
  Input,
  Select,
  Checkbox,
  RadioGroup,
} from "../../src";

export default {
  title: "Examples/Contact Form",
  parameters: { layout: "fullscreen" },
} as Meta;

export const Page = () => {
  const [values, setValues] = React.useState({
    name: "",
    email: "",
    reason: "",
    agree: false,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [success, setSuccess] = React.useState(false);

  function clearFieldError(field: string) {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!values.name)   next.name   = "This field is required.";
    if (!values.email)  next.email  = "This field is required.";
    if (!values.reason) next.reason = "Please select an option.";
    if (!values.agree)  next.agree  = "You must agree to continue.";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setSuccess(true);
  }

  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, padding: "48px 24px", maxWidth: 560, margin: "0 auto", width: "100%" }}>
          <Heading level={1}>Message Sent</Heading>
          <Text>Thanks — we'll be in touch shortly.</Text>
          <Button style={{ marginTop: 24 }} onClick={() => setSuccess(false)}>Send another</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1, padding: "48px 24px", maxWidth: 560, margin: "0 auto", width: "100%" }}>
        <Heading level={1}>Contact Us</Heading>
        <Text>Fill out the form below and we'll get back to you as soon as possible.</Text>

        <Card style={{ marginTop: 24 }}>
          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <Input
              label="Full name"
              name="name"
              placeholder="Jane Doe"
              required
              value={values.name}
              onChange={e => { setValues(v => ({ ...v, name: e.target.value })); clearFieldError("name"); }}
              error={errors.name}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              value={values.email}
              onChange={e => { setValues(v => ({ ...v, email: e.target.value })); clearFieldError("email"); }}
              error={errors.email}
            />

            <Select
              label="Reason for contact"
              name="reason"
              placeholder="Choose one…"
              required
              value={values.reason}
              onChange={e => { setValues(v => ({ ...v, reason: e.target.value })); clearFieldError("reason"); }}
              error={errors.reason}
            >
              <option value="general">General inquiry</option>
              <option value="support">Technical support</option>
              <option value="billing">Billing question</option>
              <option value="feedback">Feedback</option>
            </Select>

            <RadioGroup
              label="Preferred response time"
              name="urgency"
              defaultValue="normal"
              options={[
                { label: "No rush", value: "low" },
                { label: "Within a few days", value: "normal" },
                { label: "Urgent", value: "urgent" },
              ]}
            />

            <Checkbox
              label="I agree to the privacy policy"
              name="agree"
              required
              checked={values.agree}
              onChange={e => { setValues(v => ({ ...v, agree: e.target.checked })); clearFieldError("agree"); }}
              error={errors.agree}
            />

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <Button variant="ghost" type="button" onClick={() => { setValues({ name: "", email: "", reason: "", agree: false }); setErrors({}); }}>
                Reset
              </Button>
              <Button variant="solid" type="submit">Submit</Button>
            </div>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
};
