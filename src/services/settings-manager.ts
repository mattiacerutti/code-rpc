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
  DEFAULT_ACTIVITY_ON_FILE as DEFAULT_ACTIVITY_IN_FILE,
  DEFAULT_ACTIVITY_ON_WORKSPACE as DEFAULT_ACTIVITY_IN_WORKSPACE,
  DEFAULT_ACTIVITY_ON_EDITOR as DEFAULT_ACTIVITY_IN_EDITOR,
  DEFAULT_ACTIVITY_ON_DEBUGGING as DEFAULT_ACTIVITY_IN_DEBUGGING,
  DEFAULT_ACTIVITY_ON_IDLE as DEFAULT_ACTIVITY_IN_IDLE,
  DEFAULT_RETRY_CONNECTION,
  DEFAULT_ACTIVITY_ON_FILE_NO_WORKSPACE as DEFAULT_ACTIVITY_IN_FILE_NO_WORKSPACE,
} from "../constants";

enum Settings {
  DISCONNECT_ON_IDLE = "settings.disconnectOnIdle",
  RETRY_CONNECTION = "settings.retryConnection",
  IDLE_TIMEOUT = "settings.idleTimeout",
  RESET_ELAPSED_TIME_ON_IDLE = "settings.resetElapsedTimeOnIdle",
  IDLE_IMAGE = "images.idleImage",
  DEBUGGING_IMAGE = "images.debuggingImage",
  PLACEHOLDER_IMAGE = "images.placeholderImage",
  LANGUAGE_IMAGE_TEMPLATE = "images.languageImageTemplate",
  IDE_IMAGE_TEMPLATE = "images.ideImageTemplate",
  ACTIVITY_IN_FILE_NO_WORKSPACE = "activity.inFileWithoutWorkspace",
  ACTIVITY_IN_FILE = "activity.inFile",
  ACTIVITY_IN_WORKSPACE = "activity.inWorkspace",
  ACTIVITY_IN_EDITOR = "activity.inEditor",
  ACTIVITY_IN_DEBUGGING = "activity.inDebugging",
  ACTIVITY_IN_IDLE = "activity.inIdle",
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

  public getActivityInFileNoWorkspace(): {
    upperText: string | null;
    lowerText: string | null;
    imageText: string | null;
  } {
    const settings = this.settings.get(Settings.ACTIVITY_IN_FILE_NO_WORKSPACE, DEFAULT_ACTIVITY_IN_FILE_NO_WORKSPACE);
    return {...DEFAULT_ACTIVITY_IN_FILE_NO_WORKSPACE, ...settings};
  }

  public getActivityInFile(): {
    upperText: string | null;
    lowerText: string | null;
    imageText: string | null;
  } {
    const settings = this.settings.get(Settings.ACTIVITY_IN_FILE, DEFAULT_ACTIVITY_IN_FILE);
    return {...DEFAULT_ACTIVITY_IN_FILE, ...settings};
  }

  public getActivityInWorkspace(): {
    upperText: string | null;
    lowerText: string | null;
    imageText: string | null;
  } {
    const settings = this.settings.get(Settings.ACTIVITY_IN_WORKSPACE, DEFAULT_ACTIVITY_IN_WORKSPACE);
    return {...DEFAULT_ACTIVITY_IN_WORKSPACE, ...settings};
  }

  public getActivityInEditor(): {
    upperText: string | null;
    lowerText: string | null;
    imageText: string | null;
  } {
    const settings = this.settings.get(Settings.ACTIVITY_IN_EDITOR, DEFAULT_ACTIVITY_IN_EDITOR);
    return {...DEFAULT_ACTIVITY_IN_EDITOR, ...settings};
  }

  public getActivityInDebugging(): {
    upperText: string | null;
    lowerText: string | null;
    imageText: string | null;
  } {
    const settings = this.settings.get(Settings.ACTIVITY_IN_DEBUGGING, DEFAULT_ACTIVITY_IN_DEBUGGING);
    return {...DEFAULT_ACTIVITY_IN_DEBUGGING, ...settings};
  }

  public getActivityInIdle(): {
    upperText: string | null;
    lowerText: string | null;
    imageText: string | null;
  } {
    const settings = this.settings.get(Settings.ACTIVITY_IN_IDLE, DEFAULT_ACTIVITY_IN_IDLE);
    return {...DEFAULT_ACTIVITY_IN_IDLE, ...settings};
  }
}
