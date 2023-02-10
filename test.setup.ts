import { afterEach, expect } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';
import { fixtureCleanup } from '@open-wc/testing-helpers';
import 'element-internals-polyfill';

expect.extend(matchers);

afterEach(() => {
  fixtureCleanup();
});


class ResizeObserver {
  observe() {
  }

  unobserve() {
  }

  disconnect() {
  }
}

window.ResizeObserver = ResizeObserver;
