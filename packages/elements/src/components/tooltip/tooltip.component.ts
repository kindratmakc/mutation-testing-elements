import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { tailwind } from '../../style';

@customElement('mte-tooltip')
export class MutationTestReportThemeSwitchComponent extends LitElement {
  @property({ attribute: true })
  title!: string;

  static styles = [tailwind];

  render() {
    return html`<span class="cursor-help underline decoration-dotted" title="${this.title}"><slot></slot></span>`;
  }
}
