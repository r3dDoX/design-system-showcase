import { customElement, property, state } from 'lit/decorators.js';
import { nothing, PropertyValues, unsafeCSS } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import styles from './icon.css?inline';
import BaseElement from '../../internals/baseElement/baseElement';
import { Icons } from './icons';
import { DirectiveResult } from 'lit-html/directive';

/**
 * @property icon - Icon to display as mapped by the IconMap
 * @property size - Specify the icon size
 */
@customElement('dss-icon')
export default class Icon extends BaseElement {
  static override styles = [
    BaseElement.globalStyles,
    unsafeCSS(styles),
  ];

  @property({ type: String, reflect: true })
  public icon?: Icons;

  @property({ type: String, reflect: true })
  public size?: IconSize;

  @state()
  private svg?: DirectiveResult;

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has('icon')) {
      import(`../../assets/icons/${this.icon}.included.svg`)
        .then(iconModule => this.svg = unsafeSVG(iconModule.default))
        .catch(error => console.error(`Caught exception while importing icon: ${this.icon}`, error));
    }
  }

  protected render() {
    if (!this.svg) {
      return nothing;
    }

    return this.svg;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dss-icon': Icon;
  }
}

export const ICON_SIZE = [
  'xsmall',
  'small',
  'medium',
  'large',
] as const;

export type IconSize = typeof ICON_SIZE[number];
