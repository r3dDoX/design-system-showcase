import { describe, expect, test, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../components/button/button.component';
import { outsideClick } from './outsideClick.directive';
import { screen } from 'shadow-dom-testing-library';

describe('outsideClick.directive', () => {
  test('when click outside of element, calls given callback', async () => {
    const spy = vi.fn();
    await fixture(html`
      <div>
        <dss-button ${outsideClick(spy)}>Test</dss-button>
        <div data-testid="outside">Outside</div>
      </div>
    `);

    await screen.getByTestId('outside').click();

    expect(spy).toHaveBeenCalledOnce();
  });

  test('when click inside of element, does not call given callback', async () => {
    const spy = vi.fn();
    await fixture(html`
      <div>
        <dss-button ${outsideClick(spy)}>Test</dss-button>
        <div data-testid="outside">Outside</div>
      </div>
    `);

    await screen.getByShadowRole('button').click();

    expect(spy).not.toHaveBeenCalled();
  });
});
