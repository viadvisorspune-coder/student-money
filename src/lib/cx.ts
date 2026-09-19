/** Join the truthy class names. Port of `cx` in design-system/components/bundle.js. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
