/// <reference types="vite/client" />

// requestIdleCallback types for older TypeScript versions
interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining(): number;
}

declare global {
  interface Window {
    requestIdleCallback(callback: (deadline: IdleDeadline) => void, options?: { timeout: number }): number;
    cancelIdleCallback(handle: number): void;
    gtag?: (...args: unknown[]) => void;
  }
}

export {};
