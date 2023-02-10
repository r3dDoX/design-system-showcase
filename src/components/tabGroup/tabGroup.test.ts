import './tabGroup.component';
import '../tab/tab.component';
import { afterEach, beforeEach, describe, expect, SpyInstance, test, vi } from 'vitest';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { screen } from 'shadow-dom-testing-library';
import { DssTabGroup } from '../../index';
import { fireEvent } from '@testing-library/dom';
import { TabGroupTranslations } from './tabGroup.component';

describe('TabGroup', () => {

  describe('when there are five tabs', () => {
    const listenerSpy = vi.fn();
    let mockGetBoundingClientRect: SpyInstance;

    const fixtureWithFiveTabs = async () => await fixture(html`
      <div data-testid="tabGroupWrapper">
        <dss-tab-group
          data-testid="testTabGroup"
          .activeTabTitle=${'Tab_5'}
          .tabs=${getTabs(5)}
          .onTabActivated=${(tabTitle: string) => listenerSpy(tabTitle)}
        ></dss-tab-group>
      </div>
    `);


    beforeEach(() => {
      mockGetBoundingClientRect = vi.spyOn(Element.prototype, 'getBoundingClientRect');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    test('active tab is correctly displayed', async () => {
      mockGetBoundingClientRect.mockImplementation(() => (
        { width: 1000 } as DOMRect
      ));

      await fixtureWithFiveTabs();

      const tabs = screen.getAllByShadowRole('tab');

      expect(tabs[4]).toHaveClass('active');
    });

    test('clicked visible tab reports value to its parent', async () => {
      await fixtureWithFiveTabs();
      const firstTab = screen.getByShadowText('Tab_1');

      firstTab.click();

      expect(listenerSpy).toHaveBeenCalledWith('Tab_1');
    });
  });

  describe('when there are folded tabs', () => {
    const listenerSpy = vi.fn();
    let mockGetBoundingClientRect: SpyInstance;

    const fixtureWithFoldedTabs = async () => await fixture(html`
      <div data-testid="tabGroupWrapper">
        <dss-tab-group
          data-testid="testTabGroup"
          .activeTabTitle=${'Tab_5'}
          .tabs=${getTabs(10)}
          .onTabActivated=${(tabTitle: string) => listenerSpy(tabTitle)}
        ></dss-tab-group>
      </div>
    `);

    beforeEach(() => {
      mockGetBoundingClientRect = vi.spyOn(Element.prototype, 'getBoundingClientRect');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    test('element correctly calculates the number of visible tabs', async () => {
      mockGetBoundingClientRect.mockImplementation(() => (
        { width: 1800 } as DOMRect
      ));

      await fixtureWithFoldedTabs();
      const tabGroup = screen.getByTestId('testTabGroup') as DssTabGroup;

      expect(tabGroup).toHaveProperty('numberOfTabsToShow', 9);
    });

    test('element displays the "More" pseudo-tab', async () => {
      await fixtureWithFoldedTabs();
      mockGetBoundingClientRect.mockImplementation(() => (
        { width: 1000 } as DOMRect
      ));

      expect(screen.getByShadowText('More', { exact: false })).toBeInTheDocument();
    });

    test('tabs can be navigated-to and selected via keyboard', async () => {
      mockGetBoundingClientRect.mockImplementation(() => (
        { width: 1400 } as DOMRect
      ));

      const tabGroup = await fixtureWithFoldedTabs();
      const tabs = screen.getAllByShadowRole('tab');

      const enterKey = 'Enter';

      fireEvent.keyDown(tabs[2], { key: enterKey });
      await elementUpdated(tabGroup);

      expect(listenerSpy).toHaveBeenCalledWith('Tab_3');

      const spaceKey = ' ';

      fireEvent.keyDown(tabs[5], { key: spaceKey });
      await elementUpdated(tabGroup);

      expect(listenerSpy).toHaveBeenCalledWith('Tab_6');
    });

    test('clicking folded tabs makes them visible ', async () => {
      mockGetBoundingClientRect.mockImplementation(() => (
        { width: 800 } as DOMRect
      ));

      const wrappedTabGroup = await fixtureWithFoldedTabs();
      const actualTabGroup = screen.getByTestId('testTabGroup');

      const dropdown = actualTabGroup.shadowRoot!.querySelector('dss-dropdown');
      const dropdownTrigger = dropdown!.querySelector('dss-button');
      fireEvent.click(dropdownTrigger!, { detail: 1 });

      await elementUpdated(wrappedTabGroup);

      const menu = dropdown!.querySelector('dss-menu');
      const menuItems = Array.from(menu!.querySelectorAll('dss-menu-item'));
      const sixthTab = menuItems[2].querySelector('dss-tab');
      expect(sixthTab!.shadowRoot!.textContent).toMatch(/Tab_6/);

      fireEvent.click(sixthTab!, { detail: 1 });
      await elementUpdated(wrappedTabGroup);

      const tabPanel = screen.getByShadowRole('tabpanel');
      const visibleTabs = Array.from(tabPanel.querySelectorAll('dss-tab'));

      expect(visibleTabs[0].shadowRoot!.textContent).toMatch(/Tab_6/);
    });

    test('clicked folded tab reports value to its parent', async () => {
      mockGetBoundingClientRect.mockImplementation(() => (
        { width: 800 } as DOMRect
      ));

      await fixtureWithFoldedTabs();
      const targetMenuItem = screen.getByShadowText('Tab_6');
      fireEvent.click(targetMenuItem, { detail: 1 });

      expect(listenerSpy).toHaveBeenCalledWith('Tab_6');
    });
  });

  describe('when setting translations', () => {
    test('shows the translated "More" pseudo-tab', async () => {
      const testTranslations: TabGroupTranslations = {
        more: 'Weitere',
      };
      await fixture(html`
        <div>
          <dss-tab-group
            .tabs=${getTabs(2)}
            .translations=${testTranslations}
          ></dss-tab-group>
        </div>`);

      expect(screen.getByShadowText('Weitere', { exact: false })).toBeInTheDocument();
    });
  });
});

function getTabs(numberOfTabs: number) {
  return [...Array(numberOfTabs).keys()].map(i => {
    return { title: `Tab_${i + 1}` };
  });
}
