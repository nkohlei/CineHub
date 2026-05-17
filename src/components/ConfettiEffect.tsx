"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface ConfettiEffectProps {
  trigger: boolean;
}

export default function ConfettiEffect({ trigger }: ConfettiEffectProps) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (trigger && !hasFired.current) {
      hasFired.current = true;

      // Fire confetti from both sides
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ["#a78bfa", "#818cf8", "#6366f1", "#22c55e", "#eab308"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ["#a78bfa", "#818cf8", "#6366f1", "#22c55e", "#eab308"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();

      // Big burst in the center
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { x: 0.5, y: 0.4 },
          colors: ["#a78bfa", "#818cf8", "#6366f1", "#22c55e", "#eab308"],
        });
      }, 300);
    }

    if (!trigger) {
      hasFired.current = false;
    }
  }, [trigger]);

  return null;
}
