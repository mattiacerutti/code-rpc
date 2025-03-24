import * as vscode from "vscode";
import {
  EXTENSION_NAME,
  DEFAULT_IDLE_TIMEOUT,
  DEFAULT_DISCONNECT_ON_IDLE,
  DEFAULT_RESET_ELAPSED_TIME_ON_IDLE,
  DEFAULT_IDLE_IMAGE,
  DEFAULT_DEBUGGING_IMAGE,
  DEFAULT_PLACEHOLDER_IMAGE,
  DEFAULT_LANGUAGE_IMAGE_TEMPLATE,
  DEFAULT_IDE_IMAGE_TEMPLATE,
  DEFAULT_ACTIVITY_ON_FILE,
  DEFAULT_ACTIVITY_ON_WORKSPACE,
  DEFAULT_ACTIVITY_ON_EDITOR,
  DEFAULT_ACTIVITY_ON_DEBUGGING,
  DEFAULT_ACTIVITY_ON_IDLE,
  DEFAULT_RETRY_CONNECTION,
  DEFAULT_ACTIVITY_ON_FILE_NO_WORKSPACE,
} from "../constants";

enum Settings {
  DISCONNECT_ON_IDLE = "disconnectOnIdle",
  RETRY_CONNECTION = "retryConnection",
  IDLE_TIMEOUT = "idleTimeout",
  RESET_ELAPSED_TIME_ON_IDLE = "resetElapsedTimeOnIdle",
  IDLE_IMAGE = "idleImage",
  DEBUGGING_IMAGE = "debuggingImage",
  PLACEHOLDER_IMAGE = "placeholderImage",
  LANGUAGE_IMAGE_TEMPLATE = "languageImageTemplate",
  IDE_IMAGE_TEMPLATE = "ideImageTemplate",
  ACTIVITY_ON_FILE_NO_WORKSPACE = "activityOnFileNoWorkspace",
  ACTIVITY_ON_FILE = "activityOnFile",
  ACTIVITY_ON_WORKSPACE = "activityOnWorkspace",
  ACTIVITY_ON_EDITOR = "activityOnEditor",
  ACTIVITY_ON_DEBUGGING = "activityOnDebugging",
  ACTIVITY_ON_IDLE = "activityOnIdle",
}

export class SettingsManager {
  private settings: vscode.WorkspaceConfiguration;

  private static _instance: SettingsManager | null = null;

  constructor() {
    this.settings = vscode.workspace.getConfiguration(EXTENSION_NAME);
    SettingsManager._instance = this;

    // Listen for configuration changes
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(EXTENSION_NAME)) {
        this.settings = vscode.workspace.getConfiguration(EXTENSION_NAME);
      }
    });
  }

  public static get instance(): SettingsManager {
    if (!SettingsManager._instance) {
      SettingsManager._instance = new SettingsManager();
    }
    return SettingsManager._instance;
  }

  public getDisconnectOnIdle(): boolean {
    return this.settings.get(Settings.DISCONNECT_ON_IDLE, DEFAULT_DISCONNECT_ON_IDLE);
  }

  public getRetryConnection(): boolean {
    return this.settings.get(Settings.RETRY_CONNECTION, DEFAULT_RETRY_CONNECTION);
  }

  public getIdleTimeout(): number {  
    return this.settings.get(Settings.IDLE_TIMEOUT, DEFAULT_IDLE_TIMEOUT);
  }

  public getResetElapsedTimeOnIdle(): boolean {
    return this.settings.get(Settings.RESET_ELAPSED_TIME_ON_IDLE, DEFAULT_RESET_ELAPSED_TIME_ON_IDLE);
  }

  public getIdleImage(): string {
    return this.settings.get(Settings.IDLE_IMAGE, DEFAULT_IDLE_IMAGE);
  }

  public getDebuggingImage(): string {
    return this.settings.get(Settings.DEBUGGING_IMAGE, DEFAULT_DEBUGGING_IMAGE);
  }

  public getPlaceholderImage(): string {
    return this.settings.get(Settings.PLACEHOLDER_IMAGE, DEFAULT_PLACEHOLDER_IMAGE);
  }

  public getLanguageImageTemplate(): string {
    return this.settings.get(Settings.LANGUAGE_IMAGE_TEMPLATE, DEFAULT_LANGUAGE_IMAGE_TEMPLATE);
  }

  public getIdeImageTemplate(): string {
    return this.settings.get(Settings.IDE_IMAGE_TEMPLATE, DEFAULT_IDE_IMAGE_TEMPLATE);
  }

  public getActivityOnFileNoWorkspace(): {
    upperText: string | null;
    lowerText: string | null;
    imageText: string | null;
  } {
    const settings = this.settings.get(Settings.ACTIVITY_ON_FILE_NO_WORKSPACE, DEFAULT_ACTIVITY_ON_FILE_NO_WORKSPACE);
    return {...DEFAULT_ACTIVITY_ON_FILE_NO_WORKSPACE, ...settings};
  }

  public getActivityOnFile(): {
    upperText: string | null;
    lowerText: string | null;
    imageText: string | null;
  } {
    const settings = this.settings.get(Settings.ACTIVITY_ON_FILE, DEFAULT_ACTIVITY_ON_FILE);
    return {...DEFAULT_ACTIVITY_ON_FILE, ...settings};
  }

  public getActivityOnWorkspace(): {
    upperText: string | null;
    lowerText: string | null;
    imageText: string | null;
  } {
    const settings = this.settings.get(Settings.ACTIVITY_ON_WORKSPACE, DEFAULT_ACTIVITY_ON_WORKSPACE);
    return {...DEFAULT_ACTIVITY_ON_WORKSPACE, ...settings};
  }

  public getActivityOnEditor(): {
    upperText: string | null;
    lowerText: string | null;
    imageText: string | null;
  } {
    const settings = this.settings.get(Settings.ACTIVITY_ON_EDITOR, DEFAULT_ACTIVITY_ON_EDITOR);
    return {...DEFAULT_ACTIVITY_ON_EDITOR, ...settings};
  }

  public getActivityOnDebugging(): {
    upperText: string | null;
    lowerText: string | null;
    imageText: string | null;
  } {
    const settings = this.settings.get(Settings.ACTIVITY_ON_DEBUGGING, DEFAULT_ACTIVITY_ON_DEBUGGING);
    return {...DEFAULT_ACTIVITY_ON_DEBUGGING, ...settings};
  }

  public getActivityOnIdle(): {
    upperText: string | null;
    lowerText: string | null;
    imageText: string | null;
  } {
    const settings = this.settings.get(Settings.ACTIVITY_ON_IDLE, DEFAULT_ACTIVITY_ON_IDLE);
    return {...DEFAULT_ACTIVITY_ON_IDLE, ...settings};
  }
}
