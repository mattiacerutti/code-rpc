export function replaceData(data: Record<string, string>, text: string): string {
  return Object.keys(data).reduce((acc, key) => acc.replace(`{{${key}}}`, data[key]), text);
}
