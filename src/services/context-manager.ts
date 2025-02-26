import path from "path";
import * as vscode from "vscode";
import {SUPPORTED_LANGUAGES, LANGUAGE_EXTENSIONS, SPECIAL_FILES} from "../data/languages.json";
import {getLanguageImage, testRegex} from "../utils";
import { Variable } from "../types/variables";

export class ContextManager {
  public getEnvVariables(): Partial<Record<Variable, string | null>> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const activeTextEditor = vscode.window.activeTextEditor;

    const currentFileName = activeTextEditor ? this.getFileName(activeTextEditor) : null;
    const currentFilePath = activeTextEditor ? this.getFilePath(activeTextEditor) : null;
    const currentFileRelativePath = activeTextEditor && workspaceFolders && workspaceFolders.length > 0 ? this.getFileRelativePath(activeTextEditor, workspaceFolders[0]) : null;
    const currentFileExtension = activeTextEditor ? this.getFileExtension(activeTextEditor) : null;
    const currentFileExtensionTruncated = activeTextEditor ? this.getFileExtensionTruncated(activeTextEditor) : null;
    const currentWorkspaceName = workspaceFolders && workspaceFolders.length > 0 ? this.getWorkspaceName(workspaceFolders) : null;
    const currentEditorName = this.getEditorName();

    return {
      [Variable.CURRENT_WORKSPACE_NAME]: currentWorkspaceName,
      [Variable.CURRENT_FILE_NAME]: currentFileName,
      [Variable.CURRENT_FILE_PATH]: currentFilePath,
      [Variable.CURRENT_FILE_RELATIVE_PATH]: currentFileRelativePath,
      [Variable.CURRENT_FILE_EXTENSION]: currentFileExtension,
      [Variable.CURRENT_FILE_EXTENSION_TRUNCATED]: currentFileExtensionTruncated,
      [Variable.CURRENT_EDITOR_NAME]: currentEditorName,
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

  public isInDebugging(): boolean {
    const debugSession = vscode.debug.activeDebugSession;
    return !!debugSession;
  }

  private getFilePath(activeTextEditor: vscode.TextEditor): string {
    return activeTextEditor.document.uri.fsPath;
  }

  private getFileRelativePath(activeTextEditor: vscode.TextEditor, workspaceFolder: vscode.WorkspaceFolder): string {
    const filePath = this.getFilePath(activeTextEditor);
    const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);
    return relativePath;
  }

  private getFileName(activeTextEditor: vscode.TextEditor): string {
    const filePath = this.getFilePath(activeTextEditor);
    const fileName = path.basename(filePath);

    return fileName;
  }


  private getFileExtension(activeTextEditor: vscode.TextEditor): string {
    const filePath = this.getFilePath(activeTextEditor);
    return path.extname(filePath);
  }

  private getFileExtensionTruncated(activeTextEditor: vscode.TextEditor): string {
    const fileExtension = this.getFileExtension(activeTextEditor);
    return fileExtension.replace(".", "");
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

  public getEditorName(): string {
    return vscode.env.appName;
  }

  private getFileLanguageId(activeTextEditor: vscode.TextEditor): string | null {
    const langaugeId = activeTextEditor.document.languageId;
    if (langaugeId) {
      return langaugeId;
    }

    return null;
  }
}
