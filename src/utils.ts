export function replaceEnvVariables(data: Record<string, string | null>, text: string): string {
  return Object.keys(data).reduce((acc, key) => acc.replace(`{{${key}}}`, data[key] ?? ""), text);
}

export function isLanguageSupported(language: string): boolean {
    const supportedLanguages = require("./data/languages.json").KNOWN_LANGUAGES;
    return supportedLanguages.some((lang: any) => lang.language === language);
}

export function getLanguageImage(localImageName: string): string {
  return `https://raw.githubusercontent.com/mattiacerutti/code-rpc/main/assets/languages/${localImageName}.png`;
}

export function getEditorImage(editorName: string): string {
  const images = {
    "Cursor": "https://raw.githubusercontent.com/mattiacerutti/code-rpc/main/assets/ide/cursor.png",
    "VS Code": "https://raw.githubusercontent.com/mattiacerutti/code-rpc/main/assets/ide/vscode.png",
    "VS Code Insiders": "https://raw.githubusercontent.com/mattiacerutti/code-rpc/main/assets/ide/vscode-insiders.png",
  };

  return images[editorName as keyof typeof images] || images["VS Code"];
}


export function testRegex(input: string, testString: string): boolean {
  let regex;

  if (input.startsWith('/') && input.lastIndexOf('/') > 0) {
      const lastSlash = input.lastIndexOf('/');
      const pattern = input.slice(1, lastSlash);
      const flags = input.slice(lastSlash + 1);
      try {
          regex = new RegExp(pattern, flags);
      } catch (e) {
          return false;
      }
  }

  if (regex) {
      return regex.test(testString);
  }

  return input === testString;
}
