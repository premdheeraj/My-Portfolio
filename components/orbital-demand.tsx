'use client';

import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const signals = [
  { eyebrow: 'HOSPITAL', title: 'DEMAND', detail: 'FORECAST / 01' },
  { eyebrow: 'MODEL', title: 'EVALUATION', detail: 'QUALITY / 02' },
  { eyebrow: 'AGENT', title: 'WORKFLOWS', detail: 'SYSTEM / 03' },
  { eyebrow: 'DATA', title: 'INTEGRITY', detail: 'SIGNAL / 04' },
];

function TypedText({ value, className = '' }: { value: string; className?: string }) {
  const reduceMotion = useReducedMotion();
  const [typed, setTyped] = useState(() => (reduceMotion ? value : ''));

  useEffect(() => {
    if (reduceMotion) return;

    let position = 0;
    const timer = window.setInterval(() => {
      position += 1;
      setTyped(value.slice(0, position));
      if (position >= value.length) window.clearInterval(timer);
    }, 58);

    return () => window.clearInterval(timer);
  }, [reduceMotion, value]);

  return (
    <span className={className}>
      {reduceMotion ? value : typed}
      <span className="typing-cursor" aria-hidden="true" />
    </span>
  );
}

export function OrbitalDemand() {
  const reduceMotion = useReducedMotion();
  const [signalIndex, setSignalIndex] = useState(0);
  const [isHeld, setIsHeld] = useState(false);
  const isHeldRef = useRef(false);
  const greenRotation = useMotionValue(-12);
  const blueRotation = useMotionValue(31);
  const greenVelocity = useRef(7.2);
  const blueVelocity = useRef(-5.8);

  useEffect(() => {
    const timer = window.setInterval(
      () => setSignalIndex((current) => (current + 1) % signals.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    isHeldRef.current = isHeld;
  }, [isHeld]);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;

    const smoothing = 1 - Math.exp(-delta / 620);
    const greenTarget = isHeldRef.current ? 0 : 7.2;
    const blueTarget = isHeldRef.current ? 0 : -5.8;
    greenVelocity.current += (greenTarget - greenVelocity.current) * smoothing;
    blueVelocity.current += (blueTarget - blueVelocity.current) * smoothing;
    greenRotation.set(greenRotation.get() + greenVelocity.current * (delta / 1000));
    blueRotation.set(blueRotation.get() + blueVelocity.current * (delta / 1000));
  });

  const signal = signals[signalIndex];

  return (
    <motion.div
      className="orbital-demand"
      onHoverStart={() => setIsHeld(true)}
      onHoverEnd={() => setIsHeld(false)}
      onFocus={() => setIsHeld(true)}
      onBlur={() => setIsHeld(false)}
      tabIndex={0}
      aria-label="Live capability signals. Hover or focus to pause the orbital motion."
    >
      <div className="orbital-aura" aria-hidden="true" />
      <div className="orbit-anchor orbit-anchor-green" aria-hidden="true">
        <motion.div className="signal-orbit-path" style={{ rotate: greenRotation }}>
          <span className="orbit-node" />
        </motion.div>
      </div>
      <div className="orbit-anchor orbit-anchor-blue" aria-hidden="true">
        <motion.div className="signal-orbit-path" style={{ rotate: blueRotation }}>
          <span className="orbit-node" />
        </motion.div>
      </div>

      <motion.div
        className="signal-core"
        animate={{ scale: isHeld ? 1.035 : 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        aria-live="polite"
      >
        <TypedText key={`${signalIndex}-eyebrow`} value={signal.eyebrow} className="signal-eyebrow" />
        <TypedText key={`${signalIndex}-title`} value={signal.title} className="signal-title" />
        <TypedText key={`${signalIndex}-detail`} value={signal.detail} className="signal-detail" />
      </motion.div>

      <div className="signal-data" aria-hidden="true">
        <span>CASE LOAD</span>
        <span>{isHeld ? 'ORBIT HELD' : 'RESOURCE INDEX'}</span>
        <span>CAPACITY SIGNAL</span>
      </div>
      <span className="orbit-instruction" aria-hidden="true">
        {isHeld ? 'Release to resume' : 'Hover to hold orbit'}
      </span>
    </motion.div>
  );
}
