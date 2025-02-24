import {SetActivity} from "@xhayper/discord-rpc";
import {ContextManager} from "./context-manager";
import {Activity, ActivityStatus} from "../types/activity";
import {replaceEnvVariables} from "../utils";
import {IdleManager} from "./idle-manager";

export class ActivityManager {
  private dataRetriever: ContextManager;
  private idleManager: IdleManager;

  constructor(idleManager: IdleManager) {
    this.dataRetriever = new ContextManager();
    this.idleManager = idleManager;
  }

  public getActivity(): Activity {
    const status = this.getActivityStatus();
    const envVariables = this.dataRetriever.getEnvVariables();

    const activityDetails = this.formatActivityDetails(status, envVariables);

    const activityImage = this.getActivityImage(status) ?? undefined;
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
    if (this.dataRetriever.isInFile()) {
      return ActivityStatus.IN_FILE;
    }
    if (this.dataRetriever.isInWorkspace()) {
      return ActivityStatus.IN_WORKSPACE;
    }
    return ActivityStatus.IN_EDITOR;
  }

  private getActivityImage(status: ActivityStatus): string | null {
    switch (status) {
      case ActivityStatus.IN_FILE:
        return this.dataRetriever.getCurrentFileImage();
    }
    return null;
  }

  private formatActivityDetails(status: ActivityStatus, envVariables: Record<string, string | null>): SetActivity {
    const templates = {
      [ActivityStatus.IN_FILE]: {
        state: "Editing {{currentFileName}}",
        details: "In {{currentWorkspaceName}}",
        largeImageText: "Editing a {{currentFileExtension}} file",
      },
      [ActivityStatus.IN_WORKSPACE]: {
        state: "No file open",
        details: "In {{currentWorkspaceName}}",
        largeImageText: null,
      },
      [ActivityStatus.IN_EDITOR]: {
        state: "No project open",
        details: null,
        largeImageText: null,
      },
      [ActivityStatus.DEBUGGING]: {
        state: "Debugging {{currentFileName}}",
        details: "Debugging {{currentFileName}}",
        largeImageText: null,
      },
      [ActivityStatus.IDLE]: {
        state: "Idle",
        details: "Idle",
        largeImageText: null,
      },
    };

    return {
      state: replaceEnvVariables(envVariables, templates[status].state),
      details: templates[status].details ? replaceEnvVariables(envVariables, templates[status].details) : undefined,
      largeImageText: templates[status].largeImageText ? replaceEnvVariables(envVariables, templates[status].largeImageText) : undefined,
    };
  }
}
