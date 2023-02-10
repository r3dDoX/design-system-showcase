import { LitElement, unsafeCSS } from 'lit';
import global from './global.css?inline';

export const ActionKeystrokes = [' ', 'Enter'];
export default class BaseElement<EventsPayloadMap = Record<string, never>> extends LitElement {

  protected static globalStyles = unsafeCSS(global);

  public dispatchCustomEvent<EventName extends keyof EventsPayloadMap & string, Payload extends EventsPayloadMap[EventName]>(eventName: EventName, payload?: Payload) {
    const myCustomEvent = new CustomEvent<Payload>(eventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });

    this.dispatchEvent(myCustomEvent);
  }
}
