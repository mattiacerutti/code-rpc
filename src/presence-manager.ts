import {Client} from "@xhayper/discord-rpc";
import {ActivityManager} from "./activity-manager";

export default class PresenceManager {
  private updateInterval: NodeJS.Timeout | null = null;
  private client: Client;
  private activityManager: ActivityManager;

  constructor(clientId: string) {
    this.client = new Client({
      clientId,
    });
    this.activityManager = new ActivityManager();
  }

  public async connectAndStartUpdating() {
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

    this.client.user?.setActivity(activity.activityDetails);
  }
}
