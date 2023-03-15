import './spinner.component';
import '../icon/icon.component';
import '../tooltip/tooltip.component';
import { fixture, html } from '@open-wc/testing-helpers';
import { describe, expect, test } from 'vitest';
import { screen } from 'shadow-dom-testing-library';

describe('Spinner', () => {
  test('when rendered, can be found by role', async () => {
    await fixture(html`
      <dss-spinner>`);

    expect(screen.getByShadowRole('status')).toBeInTheDocument();
  });
});
