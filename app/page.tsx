'use client';

import { useEffect, useState } from 'react';
import GraphBackground from './graph-background';
import Link from 'next/link';

function Wordmark() {
  const [italic, setItalic] = useState<[boolean, boolean]>([false, false]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setItalic(([a, b]) => {
        if (!a && !b) return [true, false];
        if (a && !b) return [true, true];
        if (a && b) return [false, true];
        return [false, false];
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="wordmark-frame">
      <span className="registration registration-tl" aria-hidden="true">
        +
      </span>
      <span className="registration registration-tr" aria-hidden="true">
        +
      </span>
      <h1 className="wordmark">
        S
        <div className="o1">
          <span style={{ display: italic[0] ? 'none' : 'inline' }}>o</span>
          <span
            className="italic-o"
            style={{ display: italic[0] ? 'inline' : 'none' }}
          >
            o
          </span>
        </div>
        mething’s W
        <div className="o2">
          <span style={{ display: italic[1] ? 'none' : 'inline' }}>o</span>
          <span
            className="italic-o"
            style={{ display: italic[1] ? 'inline' : 'none' }}
          >
            o
          </span>
        </div>
        rking
      </h1>
      <span className="registration registration-bl" aria-hidden="true">
        +
      </span>
      <span className="registration registration-br" aria-hidden="true">
        +
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="page-shell">
      <GraphBackground />
      <nav className="corner-links top-links" aria-label="Primary">
        <Link href="#">PROJECTS</Link>
        <Link href="#">INFO</Link>
      </nav>
      <div className="centerpiece">
        <Wordmark />
      </div>
      <footer className="corner-links bottom-links">
        <Link href="#">SUBSTACK</Link>
        <p>
          Closing the gap between what’s
          <br />
          imagined and what’s real.
        </p>
        <Link href="#">CONTACT</Link>
      </footer>
    </main>
  );
}
