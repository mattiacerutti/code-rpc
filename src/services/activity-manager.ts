import {SetActivity} from "@xhayper/discord-rpc";
import {ContextManager} from "./context-manager";
import {Activity, ActivityStatus} from "../types/activity";
import {replaceEnvVariables} from "../utils";
import {IdleManager} from "./idle-manager";
import {Variable} from "../types/variables";
import { SettingsManager } from "./settings-manager";
import * as supportedIde from "../data/ide.json";

export class ActivityManager {
  private contextManager: ContextManager;

  constructor(private idleManager: IdleManager) {
    this.contextManager = new ContextManager();
  }

  public getActivity(): Activity {
    const status = this.getActivityStatus();
    const envVariables = this.contextManager.getEnvVariables();

    const activityDetails = this.formatActivityDetails(status, envVariables);

    const activityImage = this.getActivityImage(status) ?? SettingsManager.instance.getPlaceholderImage();
    activityDetails.largeImageKey = activityImage;

    return {
      status,
      activityDetails,
    };
  }

  private getActivityStatus(): ActivityStatus {
    if (this.idleManager.isIdle()) {
      return ActivityStatus.IDLE;
    }
    if (this.contextManager.isInFile()) {
      return ActivityStatus.IN_FILE;
    }
    if (this.contextManager.isInWorkspace()) {
      return ActivityStatus.IN_WORKSPACE;
    }
    if (this.contextManager.isInDebugging()) {
      return ActivityStatus.DEBUGGING;
    }
    return ActivityStatus.IN_EDITOR;
  }

  private getActivityImage(status: ActivityStatus): string | null {
    switch (status) {
      case ActivityStatus.IN_FILE:
        return this.contextManager.getCurrentFileImage();
      case ActivityStatus.DEBUGGING:
        return SettingsManager.instance.getDebuggingImage();
      case ActivityStatus.IDLE:
        return SettingsManager.instance.getIdleImage();
    }
    return null;
  }

  public getEditorName(): string {
    const editorName = this.contextManager.getEditorName();
    
    const isIdeSupported = Object.keys(supportedIde).includes(editorName);
    if (isIdeSupported) {
      return editorName;
    }

    return "VS Code"; //TODO: Create an appropriate fallback
  }

  private formatActivityDetails(status: ActivityStatus, envVariables: Partial<Record<Variable, string | null>>): SetActivity {
    let templates;
    switch (status) {
      case ActivityStatus.IN_FILE:
        templates = SettingsManager.instance.getActivityOnFile();
        break;
      case ActivityStatus.IN_WORKSPACE:
        templates = SettingsManager.instance.getActivityOnWorkspace();
        break;
      case ActivityStatus.IN_EDITOR:
        templates = SettingsManager.instance.getActivityOnEditor();
        break;
      case ActivityStatus.DEBUGGING:
        templates = SettingsManager.instance.getActivityOnDebugging();
        break;
      case ActivityStatus.IDLE:
        templates = SettingsManager.instance.getActivityOnIdle();
        break;
    }

    return {
      state: templates.upperText ? replaceEnvVariables(envVariables, templates.upperText) : undefined,
      details: templates.lowerText ? replaceEnvVariables(envVariables, templates.lowerText) : undefined,
      largeImageText: templates.imageText ? replaceEnvVariables(envVariables, templates.imageText) : undefined,
    };
  }
}
