import { describe, expect, test } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import './menuItem.component';
import MenuItem from './menuItem.component';

describe('MenuItem', () => {

  test('with no properties, has default attributes', async () => {
    const element: MenuItem = await fixture(html`
      <dss-menu-item></dss-menu-item>`);

    expect(element).toHaveAttribute('role', 'menuitem');
    expect(element).toHaveAttribute('tabindex', '0');
    expect(element).not.toHaveAttribute('selected');
  });
});
