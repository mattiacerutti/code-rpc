import {Client} from "@xhayper/discord-rpc";
import {ActivityManager} from "./activity-manager";
import {IdleManager} from "./idle-manager";
import {getEditorImage} from "../utils";
import {SettingsManager} from "./settings-manager";
import {EventEmitter} from "events";
export default class PresenceManager extends EventEmitter {
  private updateInterval: NodeJS.Timeout | null = null;

  private reconnectionTimeout: NodeJS.Timeout | null = null;
  private reconnectionInterval: NodeJS.Timeout | null = null;

  private client: Client;
  private idleManager: IdleManager;
  private editorName: string;

  private activityManager: ActivityManager;

  constructor(clientId: string) {
    super();
    this.client = new Client({
      clientId,
    });

    this.client.on("connected", () => {
      this.emit("connected");
    });

    this.client.on("disconnected", () => {
      this.emit("disconnected");
    });

    this.idleManager = new IdleManager(SettingsManager.instance.getIdleTimeout());
    this.activityManager = new ActivityManager(this.idleManager);

    this.editorName = this.activityManager.getEditorName();

    if (SettingsManager.instance.getDisconnectOnIdle()) {
      this.idleManager.onIdleChange((isIdle) => {
        if (isIdle) {
          this.stopAndDisconnect();
        } else {
          this.connectAndStartUpdating();
        }
      });
    }

    this.on("disconnected", () => {
      this.stopUpdating();
      if (SettingsManager.instance.getRetryConnection()) {
        this.startRetryConnection();
      }
    });
  }

  public async connectAndStartUpdating() {
    if (this.client.isConnected) {
      return;
    }

    
    await this.connectToClient().catch((error) => {
      this.emit("disconnected");
      throw error;
    });

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

    this.client.user
      ?.setActivity({
        ...activity.activityDetails,
        startTimestamp: this.idleManager.getLastActivityTimestamp(),
        smallImageKey: getEditorImage(this.editorName),
        smallImageText: this.editorName,
      })
      .then((value) => {
        console.log("Updated presence to: ", value);
      })
      .catch((error) => {
        console.error("Error updating presence: ", error);
      });
  }

  private async startRetryConnection() {
    if (this.reconnectionTimeout) {
      clearTimeout(this.reconnectionTimeout);
      this.reconnectionTimeout = null;
    }
    if (this.reconnectionInterval) {
      clearInterval(this.reconnectionInterval);
      this.reconnectionInterval = null;
    }

    // Try re-connecting every 10 seconds.
    this.reconnectionInterval = setInterval(async () => {
      try {
        await this.connectToClient();
        this.startUpdating();

        clearInterval(this.reconnectionInterval!);
        this.reconnectionInterval = null;

        clearTimeout(this.reconnectionTimeout!);
        this.reconnectionTimeout = null;
      } catch (_) {}
    }, 10 * 1000);

    // Stop the interval after 2 minutes.
    this.reconnectionTimeout = setTimeout(() => {
      clearInterval(this.reconnectionInterval!);
      this.reconnectionInterval = null;

      clearTimeout(this.reconnectionTimeout!);
      this.reconnectionTimeout = null;
    }, 2 * 60 * 1000);
  }
}
