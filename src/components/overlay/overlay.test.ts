import { describe, expect, test, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';
import userEvent from '@testing-library/user-event';
import './overlay.component';

describe('overlay', () => {
  test('when passed header, displays it', async () => {
    await fixture(html`
      <dss-overlay header="Test Header"></dss-overlay>
    `);

    expect(screen.getByShadowText('Test Header')).toBeInTheDocument();
  });

  test('when button clicked, emits overlay closed event', async () => {
    const closeSpy = vi.fn();
    await fixture(html`
      <dss-overlay header="Test Header" @dss-overlay-closed=${closeSpy}></dss-overlay>
    `);

    const user = userEvent.setup();
    await user.click(screen.getByShadowRole('button'));

    expect(closeSpy).toHaveBeenCalledOnce();
  });
});
