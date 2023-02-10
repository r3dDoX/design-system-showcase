import BaseElement, { ActionKeystrokes } from '../../internals/baseElement/baseElement';
import styles from './tabGroup.css?inline';
import { customElement, property, state } from 'lit/decorators.js';
import { html, PropertyValues, unsafeCSS } from 'lit';
import { TabDataInterface } from '../tab/tab.component';
import { when } from 'lit-html/directives/when.js';
import './../dropdown/dropdown.component';
import './../menu/menu.component';
import './../menuItem/menuItem.component';

export interface TabGroupEventsPayloadMap {
  'dss-group-tab-close': number;
  'dss-tab-set-active': number;
}

export interface TabGroupTranslations {
  more?: string;
}

export const DEFAULT_TAB_GROUP_TRANSLATIONS = {
  more: 'More',
};

export const ACTIVE_TAB_PROPERTY_NAME: keyof TabGroup = 'activeTabTitle';
export const TABS_PROPERTY_NAME: keyof TabGroup = 'tabs';

const MIN_TAB_WIDTH = 185;
const SHOW_MORE_TAB_WIDTH = 100;

export type DssGroupTabCloseEvent = CustomEvent<string>;
export type DssTabSetActiveEvent = CustomEvent<number>;
export type SetTabActiveHandler = (title: string) => unknown;

export const onRelevantKeyDownEvent = (event: KeyboardEvent, callback: () => any) => {
  if (ActionKeystrokes.includes(event.key)) {
    event.stopImmediatePropagation();
    event.preventDefault();
    return callback();
  }
};

/**
 * @event {DssGroupTabCloseEvent} dss-tab-close - Fires when the user presses the close button
 * @property tabs - Specify the tabs contained in this group
 * @property activeTabTitle - Specify the title of the active tab, if any
 * @property onTabActivated - Specify which action to run on tab click
 * @property onTabClose - Specify which action to run on press close button
 * @property translations - Pass translated texts
 */

@customElement('dss-tab-group')
export default class TabGroup extends BaseElement<TabGroupEventsPayloadMap> {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ attribute: false })
  public tabs: TabDataInterface[] = [];

  @property({ attribute: false })
  public activeTabTitle?: string;

  @property({ attribute: false })
  public onTabActivated!: SetTabActiveHandler;

  @property({ attribute: false })
  public onTabClose!: (event: DssGroupTabCloseEvent) => unknown;

  @state()
  private numberOfTabsToShow = this.tabs.length;

  @state()
  private localTabs: TabDataInterface[] = [];

  private resizeObserver?: ResizeObserver;

  @property({ attribute: false })
  set translations(overwrittenTranslations: TabGroupTranslations) {
    this._translations = {
      ...DEFAULT_TAB_GROUP_TRANSLATIONS,
      ...overwrittenTranslations,
    };
  }

  get translations() {
    return this._translations;
  }

  private _translations: TabGroupTranslations = DEFAULT_TAB_GROUP_TRANSLATIONS;

  override render() {
    return html`
      <div class="tab-group" role="tabpanel">
        ${this.getVisibleTabs().map((tab) => html`
          <dss-tab
            .title=${tab.title}
            .isActive=${tab.title === this.activeTabTitle}
            @dss-tab-close=${this.onTabClose}
            @click=${() => this.onTabActivated(tab.title)}
            @keydown=${(event: KeyboardEvent) => this.onKeydown(event, tab.title, this.onTabActivated)}
          ></dss-tab>
        `)}
        ${when(this.getInvisibleTabs().length > 0, () => html`
          <div class="show-more-block">
            <div class="dropdown-button">
              <dss-dropdown placement="bottom" arrow>
                <dss-button type="icon-only" slot="trigger">
                  ${this.translations.more}
                  <dss-icon icon="navigate_down" size="medium"></dss-icon>
                </dss-button>

                <dss-menu @dss-menu-selection=${(event: CustomEvent) => this.onFoldedTabClick(event.detail.value)}>
                  ${this.getInvisibleTabs().map(tab => html`
                    <dss-menu-item .value=${tab.title}>
                      <dss-tab
                        tabindex="-1"
                        .title=${tab.title}
                        .isActive=${tab.title === this.activeTabTitle}
                        .isVisible=${false}
                        @dss-tab-close=${this.onTabClose}
                      ></dss-tab>
                    </dss-menu-item>
                  `)}
                </dss-menu>
              </dss-dropdown>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.unobserve(this);
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has(TABS_PROPERTY_NAME)) {
      let recomputedTabs = [...this.tabs.filter(tab => this.localTabs.findIndex(localTab => localTab.title === tab.title) === -1), ...this.localTabs];
      if (recomputedTabs.length != this.tabs.length) {
        recomputedTabs = recomputedTabs.filter(tab => this.tabs.findIndex(localTab => localTab.title === tab.title) >= 0);
      }

      this.localTabs = [...recomputedTabs];
      this.calculateVisibleTabs();
    }

    if (changedProperties.has(ACTIVE_TAB_PROPERTY_NAME) && this.activeTabTitle) {
      const newActiveTabIndex = this.localTabs.findIndex(tab => tab.title === this.activeTabTitle);

      if (newActiveTabIndex >= this.getVisibleTabs().length) {
        this.moveFoldedTabToVisible(this.activeTabTitle);
      }
    }
  }

  private calculateVisibleTabs() {
    const elementWidth = this.getBoundingClientRect().width;

    if (Math.floor(elementWidth / MIN_TAB_WIDTH) < this.tabs.length) {
      const adjustedAvailableWidth = elementWidth - SHOW_MORE_TAB_WIDTH;
      this.numberOfTabsToShow = Math.floor(adjustedAvailableWidth / MIN_TAB_WIDTH);
    } else {
      this.numberOfTabsToShow = this.tabs.length;
    }
  }

  private onResize() {
    this.calculateVisibleTabs();
  }

  private getVisibleTabs() {
    return this.localTabs.slice(0, this.numberOfTabsToShow);
  }

  private getInvisibleTabs() {
    return this.localTabs.slice(this.numberOfTabsToShow);
  }

  private onKeydown(event: KeyboardEvent, title: string, action: (title: string) => void) {
    onRelevantKeyDownEvent(event, () => action(title));
  }

  private onFoldedTabClick(title: string) {
    this.moveFoldedTabToVisible(title);
    this.onTabActivated(title);
  }

  private moveFoldedTabToVisible(title: string) {
    const tabToMove = this.localTabs.find(tab => tab.title === title);

    if (tabToMove) {
      const otherTabs = [...this.localTabs.filter(tab => tab.title !== title)];
      this.localTabs = [tabToMove, ...otherTabs];
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-tab-group': TabGroup;
  }

  interface WindowEventMap {
    'dss-group-tab-close': DssGroupTabCloseEvent;
    'dss-tab-set-active': DssTabSetActiveEvent;
  }
}
