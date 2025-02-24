import {SetActivity} from "@xhayper/discord-rpc";
import {ContextManager} from "./context-manager";
import {Activity, ActivityStatus} from "../types/activity";
import {replaceEnvVariables} from "../utils";
import {IdleManager} from "./idle-manager";

const DEFAULT_IDLE_IMAGE = "https://raw.githubusercontent.com/mattiacerutti/code-rpc/main/assets/idle.png";
const PLACEHOLDER_IMAGE= "https://raw.githubusercontent.com/mattiacerutti/code-rpc/main/assets/placeholder.png";

export class ActivityManager {
  private contextManager: ContextManager;
  private idleManager: IdleManager;

  constructor(idleManager: IdleManager) {
    this.contextManager = new ContextManager();
    this.idleManager = idleManager;
  }

  public getActivity(): Activity {
    const status = this.getActivityStatus();
    const envVariables = this.contextManager.getEnvVariables();

    const activityDetails = this.formatActivityDetails(status, envVariables);

    const activityImage = this.getActivityImage(status) ?? PLACEHOLDER_IMAGE;
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
    return ActivityStatus.IN_EDITOR;
  }

  private getActivityImage(status: ActivityStatus): string | null {
    switch (status) {
      case ActivityStatus.IN_FILE:
        return this.contextManager.getCurrentFileImage();
      case ActivityStatus.IDLE:
        return DEFAULT_IDLE_IMAGE;
    }
    return null;
  }

  public getEditorName(): string {
    return this.contextManager.getEditorName();
  }

  private formatActivityDetails(status: ActivityStatus, envVariables: Record<string, string | null>): SetActivity {
    const templates = {
      [ActivityStatus.IN_FILE]: {
        state: "Editing {{currentFileName}}",
        details: "In workspace: {{currentWorkspaceName}}",
        largeImageText: "Editing a {{currentFileExtension}} file",
      },
      [ActivityStatus.IN_WORKSPACE]: {
        state: "No file currently open",
        details: "In workspace: {{currentWorkspaceName}}",
        largeImageText: null,
      },
      [ActivityStatus.IN_EDITOR]: {
        state: "No project currently open",
        details: "In the editor",
        largeImageText: null,
      },
      [ActivityStatus.DEBUGGING]: {
        state: "Debugging {{currentFileName}}",
        details: "Debugging {{currentFileName}}",
        largeImageText: null,
      },
      [ActivityStatus.IDLE]: {
        state: "Inactive..",
        details: null,
        largeImageText: "💤",
      },
    };

    return {
      state: replaceEnvVariables(envVariables, templates[status].state),
      details: templates[status].details ? replaceEnvVariables(envVariables, templates[status].details) : undefined,
      largeImageText: templates[status].largeImageText ? replaceEnvVariables(envVariables, templates[status].largeImageText) : undefined,
    };
  }
}
