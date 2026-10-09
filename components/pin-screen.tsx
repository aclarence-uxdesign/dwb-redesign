"use client";

import { useEffect, useRef, useState } from "react";
import { REGISTRATION_PIN } from "@/lib/board-data";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"] as const;

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5m0-8a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.83 9 15 12.16V12a3 3 0 0 0-3-3c-.06 0-.11 0-.17 0m-4.3.8 1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22 21 20.73 3.27 3zM12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93C21.07 15.5 22.27 13.86 23 12c-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-4 0.7l2.17 2.15C10.74 7.13 11.35 7 12 7"
      />
    </svg>
  );
}

export function PinScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const pushRef = useRef<(digit: string) => void>(() => {});

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key >= "0" && event.key <= "9") {
        event.preventDefault();
        pushRef.current(event.key);
      } else if (event.key === "Backspace") {
        event.preventDefault();
        setPin((current) => current.slice(0, -1));
        setError(false);
      } else if (event.key === "Escape") {
        setPin("");
        setError(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function push(digit: string) {
    setError(false);
    setPin((current) => {
      if (current.length >= 4) return current;
      const next = current + digit;
      if (next.length === 4) {
        window.setTimeout(() => submit(next), 140);
      }
      return next;
    });
  }

  pushRef.current = push;

  function submit(value: string) {
    if (value === REGISTRATION_PIN) {
      onSuccess();
      return;
    }
    setError(true);
    setShake(true);
    window.setTimeout(() => {
      setShake(false);
      setPin("");
    }, 420);
  }

  return (
    <div className="pin-layout">
      <div className="pin-block">
        <div className="pin-copy">
          <h1>Registration</h1>
          <p data-error={error} role="status">
            {error
              ? "That PIN was not recognized. Please try again."
              : "Please enter the Device Registration PIN."}
          </p>
        </div>
        <div className="pin-pad" data-shake={shake}>
          <div className="pin-display" data-visible={visible}>
            <span className="pin-value" aria-live="polite">
              {visible ? pin : "•".repeat(pin.length)}
            </span>
            <button
              type="button"
              className="pin-visibility"
              aria-pressed={visible}
              aria-label={visible ? "Hide PIN" : "Show PIN"}
              onClick={() => setVisible((current) => !current)}
            >
              {visible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          <div className="pin-keys">
            {keys.map((key) => {
              if (key === "clear") {
                return (
                  <button
                    key={key}
                    type="button"
                    className="pin-key"
                    aria-label="Clear PIN"
                    onClick={() => {
                      setPin("");
                      setError(false);
                    }}
                  >
                    <img src="/media/icon-close.svg" alt="" width={38} height={38} />
                  </button>
                );
              }
              if (key === "back") {
                return (
                  <button
                    key={key}
                    type="button"
                    className="pin-key"
                    aria-label="Delete last digit"
                    onClick={() => {
                      setPin((current) => current.slice(0, -1));
                      setError(false);
                    }}
                  >
                    <img src="/media/icon-backspace.svg" alt="" width={38} height={38} />
                  </button>
                );
              }
              return (
                <button key={key} type="button" className="pin-key" onClick={() => push(key)}>
                  {key}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
