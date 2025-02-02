import { nothing, TemplateResult } from 'lit';
import { TestStatus } from 'mutation-testing-metrics';
import { MutantStatus, OpenEndLocation } from 'mutation-testing-report-schema/api';
import { renderEmoji } from '../components/drawer-mutant/util';
import { DRAWER_HALF_OPEN_SIZE } from '../components/drawer/drawer.component';

export function notNullish<T>(value: T | undefined | null): value is T {
  return value !== null && value !== undefined;
}

export function renderIf(
  condition: unknown,
  consequence: (() => TemplateResult) | TemplateResult | string
): string | TemplateResult | typeof nothing {
  if (condition) {
    if (typeof consequence === 'function') {
      return consequence();
    } else {
      return consequence;
    }
  } else {
    return nothing;
  }
}

export function renderIfPresent<T>(value: T | undefined | null, factory: (value: T) => TemplateResult): TemplateResult | typeof nothing {
  if (value === null || value === undefined) {
    return nothing;
  } else {
    return factory(value);
  }
}

export function getContextClassForStatus(status: MutantStatus) {
  switch (status) {
    case MutantStatus.Killed:
      return 'success';
    case MutantStatus.NoCoverage:
      return 'caution';
    case MutantStatus.Survived:
      return 'danger';
    case MutantStatus.Timeout:
      return 'warning';
    case MutantStatus.Ignored:
    case MutantStatus.RuntimeError:
    case MutantStatus.CompileError:
      return 'secondary';
  }
}

export function getContextClassForTestStatus(status: TestStatus) {
  switch (status) {
    case TestStatus.Killing:
      return 'success';
    case TestStatus.Covering:
      return 'warning';
    case TestStatus.NotCovering:
      return 'caution';
  }
}

export function getEmojiForTestStatus(status: TestStatus) {
  switch (status) {
    case TestStatus.Killing:
      return renderEmoji('✅', status);
    case TestStatus.Covering:
      return renderEmoji('☂', status);
    case TestStatus.NotCovering:
      return renderEmoji('🌧', status);
  }
}

export function getEmojiForStatus(status: MutantStatus) {
  switch (status) {
    case MutantStatus.Killed:
      return renderEmoji('✅', status);
    case MutantStatus.NoCoverage:
      return renderEmoji('🙈', status);
    case MutantStatus.Ignored:
      return renderEmoji('🤥', status);
    case MutantStatus.Survived:
      return renderEmoji('👽', status);
    case MutantStatus.Timeout:
      return renderEmoji('⌛', status);
    case MutantStatus.RuntimeError:
    case MutantStatus.CompileError:
      return renderEmoji('💥', status);
  }
}

export function escapeHtml(unsafe: string) {
  return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function toAbsoluteUrl(...fragments: string[]): string {
  // Use absolute url because of https://github.com/stryker-mutator/mutation-testing-elements/issues/53
  const url = new URL(window.location.href);
  return new URL(`#${fragments.filter(Boolean).join('/')}`, url).href;
}

export function plural(items: unknown[]): string {
  if (items.length > 1) {
    return 's';
  }
  return '';
}

export function describeLocation({ fileName, location }: { fileName: string; location?: OpenEndLocation | undefined }) {
  return fileName ? `${fileName}${location ? `:${location.start.line}:${location.start.column}` : ''}` : '';
}

export function scrollToCodeFragmentIfNeeded(el: Element | null) {
  if (el && !isElementInViewport(el)) {
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}

function isElementInViewport(el: Element) {
  const { top, bottom } = el.getBoundingClientRect();

  return top >= 0 && bottom <= (window.innerHeight || document.documentElement.clientHeight) - DRAWER_HALF_OPEN_SIZE;
}
