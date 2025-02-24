import path from "path";
import * as vscode from "vscode";
import {SUPPORTED_LANGUAGES, LANGUAGE_EXTENSIONS, SPECIAL_FILES} from "../data/languages.json";
import {getLanguageImage, testRegex} from "../utils";

export class ContextManager {
  public getEnvVariables(): Record<string, string | null> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const activeTextEditor = vscode.window.activeTextEditor;

    const currentFileName = activeTextEditor ? this.getFileName(activeTextEditor) : null;
    const currentFileExtension = activeTextEditor ? this.getFileExtension(activeTextEditor) : null;
    const currentWorkspaceName = workspaceFolders && workspaceFolders.length > 0 ? this.getWorkspaceName(workspaceFolders) : null;

    return {
      currentWorkspaceName,
      currentFileName,
      currentFileExtension,
    };
  }

  public isInFile(): boolean {
    const editor = vscode.window.activeTextEditor;
    return !!editor;
  }

  public isInWorkspace(): boolean {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    return !!(workspaceFolders && workspaceFolders.length > 0);
  }

  private getFileName(activeTextEditor: vscode.TextEditor): string {
    const filePath = activeTextEditor.document.uri.fsPath;
    const fileName = path.basename(filePath);

    return fileName;
  }


  private getFileExtension(activeTextEditor: vscode.TextEditor): string {
    return path.extname(activeTextEditor.document.uri.fsPath);
  }

  private getWorkspaceName(workspaceFolders: readonly vscode.WorkspaceFolder[]): string {
    const workspaceName = workspaceFolders[0].name;
    return workspaceName;
  }

  public getCurrentFileImage(): string | null {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return null;
    }

    const fileExtension = this.getFileExtension(editor);
    const fileName = this.getFileName(editor);

    // We check if the extensions is in the SPECIAL_FILES object
    for (const [extension, data] of Object.entries(SPECIAL_FILES)) {
      if (testRegex(extension, fileExtension) || testRegex(extension, fileName)) {
        return getLanguageImage(data.image);
      }
    }

    // If we find the languageId directly from the editor, we extract its image immediately
    const languageId = this.getFileLanguageId(editor);
    if (languageId) {
      for (const data of Object.values(SUPPORTED_LANGUAGES)) {
        if (data["lang-id"] === languageId) {
          return getLanguageImage(data.image);
        }
      }
    }

    // If we don't find the languageId directly from the editor and in SPECIAL_FILES, we check if the file extension is in the LANGUAGE_EXTENSIONS object
    for (const [extension, data] of Object.entries(LANGUAGE_EXTENSIONS)) {
      if (testRegex(extension, fileExtension)) {
        const languageKey = data.language as keyof typeof SUPPORTED_LANGUAGES;
        const languageData = SUPPORTED_LANGUAGES[languageKey];
        if (languageData) {
          return getLanguageImage(languageData.image);
        }
        throw new Error(`Extension was found for ${fileExtension} but its language was not found in the SUPPORTED_LANGUAGES object. This should never happen.`);
      }
    }

    return null;
  }

  private getFileLanguageId(activeTextEditor: vscode.TextEditor): string | null {
    const langaugeId = activeTextEditor.document.languageId;
    if (langaugeId) {
      return langaugeId;
    }

    return null;
  }
}
