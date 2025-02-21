import {SetActivity} from "@xhayper/discord-rpc";
import {ContextManager} from "./context-manager";
import {Activity, ActivityStatus} from "../types/activity";
import {replaceData} from "../utils";
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
    const data = this.getRelevantData(status);

    const activityDetails = this.formatActivityDetails(status, data);

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

  private getRelevantData(status: ActivityStatus): Record<string, string> {
    switch (status) {
      case ActivityStatus.IN_FILE:
        return this.dataRetriever.getFileDetails();
      case ActivityStatus.IN_WORKSPACE:
        return this.dataRetriever.getWorkspaceDetails();
      case ActivityStatus.DEBUGGING:
      // return this.dataRetriever.getDebuggingDetails();
      default:
        return {};
    }
  }

  private formatActivityDetails(status: ActivityStatus, data: Record<string, string>): SetActivity {
    const templates = {
      [ActivityStatus.IN_FILE]: {
        state: "Editing {{currentFileName}}",
        details: "In {{currentWorkspaceName}}",
      },
      [ActivityStatus.IN_WORKSPACE]: {
        state: "No file open",
        details: "In {{currentWorkspaceName}}",
      },
      [ActivityStatus.IN_EDITOR]: {
        state: "No project open",
        details: null,
      },
      [ActivityStatus.DEBUGGING]: {
        state: "Debugging {{currentFileName}}",
        details: "Debugging {{currentFileName}}",
      },
      [ActivityStatus.IDLE]: {
        state: "Idle",
        details: "Idle",
      },
    };

    return {
      state: replaceData(data, templates[status].state),
      details: templates[status].details ? replaceData(data, templates[status].details) : undefined,
    };
  }
}
