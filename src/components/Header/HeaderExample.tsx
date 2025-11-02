import * as React from "react";
import Header from "./index";

export default function HeaderExample() {
  return (
    <Header
      left={<div>Logo</div>}
      center={<div style={{ fontWeight: 600 }}>Page title</div>}
      right={<div>Profile</div>}
    />
  );
}
