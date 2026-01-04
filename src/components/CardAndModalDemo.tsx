import * as React from "react";
import { Button } from "./Button";
import { Modal } from "./Modal/Modal";
import { Card } from "./Card/Card";

export function CardDemo() {
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Card Component</h1>
      <Card title="Default Card" subtitle="This is a subtle subtitle">
        This is a regular card with title, subtitle, and content.
      </Card>

      <div style={{ marginTop: "20px" }} />

      <Card title="Elevated Card" subtitle="Enhanced shadow" elevated>
        This card has extra elevation for more visual prominence.
      </Card>
    </div>
  );
}

export function ModalDemo() {
  const [openBasic, setOpenBasic] = React.useState(false);
  const [openCustom, setOpenCustom] = React.useState(false);
  const [result, setResult] = React.useState<string>("");

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Modal Component</h1>

      <div style={{ marginBottom: "40px" }}>
        <h2>Basic Modal</h2>
        <Button onClick={() => setOpenBasic(true)}>Open Modal</Button>
        <Modal
          open={openBasic}
          onClose={() => setOpenBasic(false)}
          title="Confirm Action"
        >
          Are you sure you want to proceed? This action cannot be undone.
        </Modal>
      </div>

      <div>
        <h2>Custom Actions Modal</h2>
        <Button onClick={() => setOpenCustom(true)}>Open Custom Modal</Button>
        <Modal
          open={openCustom}
          onClose={(action: string | undefined) => {
            setResult(`You clicked: ${action || "closed"}`);
            setOpenCustom(false);
          }}
          title="Choose an Option"
          actions={[
            { label: "Yes, Confirm", variant: "confirm" },
            { label: "No, Cancel", variant: "danger" },
            { label: "Maybe Later", variant: "secondary" },
          ]}
        >
          What would you like to do?
        </Modal>
        {result ? <p style={{ marginTop: "20px", color: "var(--primary)" }}>{result}</p> : null}
      </div>
    </div>
  );
}
