import { directive, DirectiveParameters, Part, PartType } from 'lit-html/directive.js';
import { AsyncDirective } from 'lit-html/async-directive.js';
import { nothing } from 'lit';

class OutsideClickDirective extends AsyncDirective {
  private removeEventListener?: () => void;

  protected disconnected(): void {
    this.removeEventListener?.();
    super.disconnected();
  }

  // @ts-ignore
  render(callbackFunction: () => void) {
    return nothing;
  }

  update(part: Part, props: DirectiveParameters<this>): unknown {
    if (this.isConnected && part.type === PartType.ELEMENT) {
      this.removeEventListener?.();
      this.removeEventListener = this.monitorClicks(props[0], part.element);
    }
    return super.update(part, props);
  }

  private monitorClicks(callbackFunction: DirectiveParameters<this>[0], element: Element): () => void {
    const handler = (event: Event) => {
      if (!event.composedPath().some(node => node === element)) {
        callbackFunction();
      }
    };
    window.addEventListener('click', handler, { passive: true });
    return () => window.removeEventListener('click', handler);
  }
}

export const outsideClick = directive(OutsideClickDirective);
