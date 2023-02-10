import { describe, expect, test } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';
import './errorMessage';

describe('error-message', () => {
  test('shows given message', async () => {
    await fixture(html`
      <dss-error-message message="Test message"></dss-error-message>
    `);

    expect(screen.getByShadowText('Test message')).toBeInTheDocument();
  });

  test('shows icon when state error', async () => {
    await fixture(html`
      <dss-error-message state="error" message="message"></dss-error-message>
    `);

    expect(screen.getByShadowTestId('error-icon')).toHaveAttribute('icon', 'sign_stop');
  });

  test('shows icon when state warning', async () => {
    await fixture(html`
      <dss-error-message state="warning" message="message"></dss-error-message>
    `);

    expect(screen.getByShadowTestId('error-icon')).toHaveAttribute('icon', 'sign_warning');
  });

  test('shows no error when no message given', async () => {
    await fixture(html`
      <dss-error-message state="warning"></dss-error-message>
    `);

    expect(screen.queryByShadowTestId('error-icon')).not.toBeInTheDocument();
  });
});
