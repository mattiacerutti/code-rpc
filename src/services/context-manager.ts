import path from "path";
import * as vscode from "vscode";

export class ContextManager {
  public getFileDetails(): Record<string, string> {
    const currentFileName = this.getCurrentFile();
    const currentWorkspaceName = this.getCurrentWorkspace();

    if (!currentFileName || !currentWorkspaceName) {
      throw new Error("No file or workspace name found while in status IN_FILE");
    }

    return {
      currentFileName,
      currentWorkspaceName,
    };
  }

  public getWorkspaceDetails(): Record<string, string> {
    const currentWorkspaceName = this.getCurrentWorkspace();

    if (!currentWorkspaceName) {
      throw new Error("No workspace name found while in status IN_WORKSPACE");
    }

    return {
      currentWorkspaceName,
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

  private getCurrentFile(): string | null {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return null;
    }

    const filePath = editor.document.uri.fsPath;
    const fileName = path.basename(filePath);

    return fileName;
  }

  private getCurrentWorkspace(): string | null {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      const workspaceName = workspaceFolders[0].name;
      return workspaceName;
    }
    return null;
  }
}
