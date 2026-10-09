"use client";

import { useEffect, useRef, useState } from "react";
import { REGISTRATION_PIN } from "@/lib/board-data";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"] as const;

export function PinScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
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
          <div className="pin-display" aria-live="polite">
            {pin}
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
