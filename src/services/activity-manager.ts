import {SetActivity} from "@xhayper/discord-rpc";
import {ContextManager} from "./context-manager";
import {Activity, ActivityStatus} from "../types/activity";
import {replaceEnvVariables} from "../utils";
import {IdleManager} from "./idle-manager";
import {Variable} from "../types/variables";
import { SettingsManager } from "./settings-manager";

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
      if (this.contextManager.isInWorkspace()) {
        return ActivityStatus.IN_FILE;
      }
      return ActivityStatus.IN_FILE_NO_WORKSPACE;
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
      case ActivityStatus.IN_FILE_NO_WORKSPACE:
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
    
    return editorName;
  }

  private formatActivityDetails(status: ActivityStatus, envVariables: Partial<Record<Variable, string | null>>): SetActivity {
    let templates;
    switch (status) {
      case ActivityStatus.IN_FILE_NO_WORKSPACE:
        templates = SettingsManager.instance.getActivityInFileNoWorkspace();
        break;
      case ActivityStatus.IN_FILE:
        templates = SettingsManager.instance.getActivityInFile();
        break;
      case ActivityStatus.IN_WORKSPACE:
        templates = SettingsManager.instance.getActivityInWorkspace();
        break;
      case ActivityStatus.IN_EDITOR:
        templates = SettingsManager.instance.getActivityInEditor();
        break;
      case ActivityStatus.DEBUGGING:
        templates = SettingsManager.instance.getActivityInDebugging();
        break;
      case ActivityStatus.IDLE:
        templates = SettingsManager.instance.getActivityInIdle();
        break;
    }

    return {
      state: templates.upperText ? replaceEnvVariables(envVariables, templates.upperText) : undefined,
      details: templates.lowerText ? replaceEnvVariables(envVariables, templates.lowerText) : undefined,
      largeImageText: templates.imageText ? replaceEnvVariables(envVariables, templates.imageText) : undefined,
    };
  }
}
