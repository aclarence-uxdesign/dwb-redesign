"use client";

import { useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailDialog({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("abc123@hospital.com");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function submit() {
    if (!emailPattern.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSent(true);
    window.setTimeout(onClose, 1100);
  }

  return (
    <div className="scrim" role="presentation" onMouseDown={onClose}>
      <form
        className="email-card"
        role="dialog"
        aria-labelledby="email-title"
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <h2 id="email-title">{sent ? "Email sent" : "Send an email"}</h2>
        <input
          type="email"
          value={email}
          aria-label="Email address"
          data-invalid={Boolean(error)}
          disabled={sent}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
        />
        <p className="email-note">{sent ? `Sent to ${email}` : error}</p>
        <div className="email-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            {sent ? "Close" : "Cancel"}
          </button>
          <button type="submit" className="btn-send" disabled={sent}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
