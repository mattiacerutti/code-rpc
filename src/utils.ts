import {SettingsManager} from "./services/settings-manager";
import * as supportedIde from "./data/ide.json";

export function replaceEnvVariables(data: Record<string, string | null>, text: string): string {
  return Object.keys(data).reduce((acc, key) => acc.replace(`{{${key}}}`, data[key] ?? ""), text);
}

export function getLanguageImage(localImageName: string): string {
  const templateLink = SettingsManager.instance.getLanguageImageTemplate();
  return templateLink.replace("{{language}}", localImageName);
}

export function getEditorImage(editorName: string): string {
  const templateLink = SettingsManager.instance.getIdeImageTemplate();

  let ideId = supportedIde[editorName as keyof typeof supportedIde] ?? "vscode";

  return templateLink.replace("{{ide}}", ideId);
}

export function testRegex(input: string, testString: string): boolean {
  let regex;

  if (input.startsWith("/") && input.lastIndexOf("/") > 0) {
    const lastSlash = input.lastIndexOf("/");
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

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
