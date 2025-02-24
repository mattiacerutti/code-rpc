import {Client} from "@xhayper/discord-rpc";
import {ActivityManager} from "./activity-manager";
import {IdleManager} from "./idle-manager";
import { getEditorImage } from "../utils";

const MOCK_IDLE_DISCONNECT_SETTING = false;

export default class PresenceManager {
  private updateInterval: NodeJS.Timeout | null = null;
  private client: Client;
  private activityManager: ActivityManager;
  private idleManager: IdleManager;

  private editorName: string;

  constructor(clientId: string) {
    this.client = new Client({
      clientId,
    });
    this.idleManager = new IdleManager();
    this.activityManager = new ActivityManager(this.idleManager);

    this.editorName = this.activityManager.getEditorName();

    if (MOCK_IDLE_DISCONNECT_SETTING) {
      this.idleManager.onIdleChange((isIdle) => {
        if (isIdle) {
          this.stopAndDisconnect();
        } else {
          this.connectAndStartUpdating();
        }
      });
    }

  }

  public async connectAndStartUpdating() {
    if (this.client.isConnected) {
      return;
    }

    await this.connectToClient();
    this.startUpdating();
  }

  public async stopAndDisconnect() {
    this.stopUpdating();
    await this.disconnectFromClient();
  }

  private async connectToClient() {
    await this.client.connect();
  }

  private async disconnectFromClient() {
    await this.client.destroy();
  }

  private startUpdating() {
    this.updatePresence();
    this.updateInterval = setInterval(() => this.updatePresence(), 15000);
  }

  private stopUpdating() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private updatePresence() {

    const activity = this.activityManager.getActivity();

    this.client.user?.setActivity({
      ...activity.activityDetails,
      startTimestamp: this.idleManager.getLastActivityTimestamp(),
      smallImageKey: getEditorImage(this.editorName),
      smallImageText: this.editorName,
    }).then((value) => {
      console.log("Updated presence to: ", value);
    }).catch((error) => {
      console.error("Error updating presence: ", error);
    });
  }
}
