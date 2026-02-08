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

export const Page = () => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <Header />
    <main
      style={{
        flex: 1,
        padding: "48px 24px",
        maxWidth: 560,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <Heading level={1}>Contact Us</Heading>
      <Text>
        Fill out the form below and we'll get back to you as soon as possible.
      </Text>

      <Card style={{ marginTop: 24 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Form submitted!");
          }}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          <Input
            label="Full name"
            name="name"
            placeholder="Jane Doe"
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />

          <Select
            label="Reason for contact"
            name="reason"
            placeholder="Choose one…"
            required
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
          />

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Button variant="ghost">Cancel</Button>
            <Button
              variant="solid"
              onClick={() => {
                const form = document.querySelector("form");
                if (form?.reportValidity()) form.requestSubmit();
              }}
            >
              Submit
            </Button>
          </div>
        </form>
      </Card>
    </main>
    <Footer />
  </div>
);
