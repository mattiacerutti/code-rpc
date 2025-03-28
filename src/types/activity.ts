import { SetActivity } from "@xhayper/discord-rpc";

export interface Activity {
  status: ActivityStatus,
  activityDetails: SetActivity
}

export enum ActivityStatus {
  IN_FILE_NO_WORKSPACE, // Actively editing a file but no workspace is open
  IN_FILE,           // Actively editing a file in a workspace
  IN_WORKSPACE,      // Inside VSCode with a workspace open but no file active
  IN_EDITOR,         // VSCode is open but no project/workspace is loaded
  IDLE,              // VSCode is open (could be also in a file!) but user is inactive (no recent interactions)
  DEBUGGING,         // Actively running the debugger
}
