import {Client} from "@xhayper/discord-rpc";
import {ActivityManager} from "./activity-manager";
import {IdleManager} from "./idle-manager";
import {getEditorImage} from "../utils";
import {SettingsManager} from "./settings-manager";
import {EventEmitter} from "events";
import { ConnectionStatus } from "../types/connection-status";

type PresenceManagerEvents = ConnectionStatus | "disconnected";

export default class PresenceManager extends EventEmitter {
  private updateInterval: NodeJS.Timeout | null = null;

  private reconnectionTimeout: NodeJS.Timeout | null = null;
  private reconnectionInterval: NodeJS.Timeout | null = null;

  private client: Client;
  private idleManager: IdleManager;
  private editorName: string;

  private activityManager: ActivityManager;

  private connectionStatus: ConnectionStatus = ConnectionStatus.USER_DISCONNECTED;

    // Overriding emit to restrict event types
    public emit(event: PresenceManagerEvents, ...args: any[]): boolean {
      return super.emit(event, ...args);
    }

  constructor(clientId: string) {
    super();
    this.client = new Client({
      clientId,
      transport: {
        type: "ipc",
      }
    });

    this.client.on("connected", async () => {
      await this.changeConnectionStatus(ConnectionStatus.CONNECTED);
    });

    this.client.on("disconnected", async () => {
      console.log("Received disconnection event with status:", this.connectionStatus);

      // If the connection status is connected, it means that the connection was unexpectedly disrupted. 
      // Any other kind of disconnection would change the status first.
      if(this.connectionStatus === ConnectionStatus.CONNECTED) {
        await this.changeConnectionStatus(ConnectionStatus.LOST_UNEXPECTEDLY);
      }
    });

    this.idleManager = new IdleManager(SettingsManager.instance.getIdleTimeout());
    this.activityManager = new ActivityManager(this.idleManager);

    this.editorName = this.activityManager.getEditorName();

    if (SettingsManager.instance.getDisconnectOnIdle()) {
      this.idleManager.onIdleChange((isIdle) => {
        if (isIdle) {
          if(this.connectionStatus === ConnectionStatus.CONNECTED) {
            this.stopAndDisconnect(true);
          }
        } else {
          if(this.connectionStatus === ConnectionStatus.SYSTEM_DISCONNECTED) {
            this.connectAndStartUpdating();
          }
        }
      });
    }

    this.on(ConnectionStatus.LOST_UNEXPECTEDLY, () => {
      console.log("RPC unexpectedly Disconnected");
      this.stopUpdating();
      if (SettingsManager.instance.getRetryConnection()) {
        console.log("Starting retry connection");
        this.startRetryConnection();
      }
    });
  }

  private async changeConnectionStatus(status: ConnectionStatus, statusChangeCallback: () => Promise<void> = async () => {}) {
    this.connectionStatus = status;
    
    await statusChangeCallback();
    this.emit(status);

    // Do not emit the "disconnected" event (used as a general event to sync UI) if system disconnected because we do not treat it as a proper disconnection but rather as a state
    if(status !== ConnectionStatus.CONNECTED && status !== ConnectionStatus.SYSTEM_DISCONNECTED) {
      this.emit("disconnected");
    }
  }

  public async connectAndStartUpdating() {
    if (this.client.isConnected) {
      return;
    }

    
    await this.connectToClient().catch(async (error) => {
      await this.changeConnectionStatus(ConnectionStatus.LOST_UNEXPECTEDLY);
      throw error;
    });

    this.startUpdating();
  }

  public async stopAndDisconnect(isSystemDisconnected: boolean = false) {
    this.stopUpdating();
    await this.disconnectFromClient(isSystemDisconnected);
  }

  private async connectToClient() {
    await this.client.connect();
    console.log("Connected to client");
  }

  private async disconnectFromClient(isSystemDisconnected: boolean = false) {
    const newStatus = isSystemDisconnected ? ConnectionStatus.SYSTEM_DISCONNECTED : ConnectionStatus.USER_DISCONNECTED;

    await this.changeConnectionStatus(newStatus, async () => {
        if(this.client.isConnected) {
          await this.client.destroy();
        }
    });

    console.log("Disconnected from client");
  }

  private startUpdating() {
    this.idleManager.resetTimer();
    this.updatePresence();
    this.updateInterval = setInterval(() => this.updatePresence(), 15333);
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
      console.log("Retrying connection...");
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
      console.log("Stopping to retry connection");
      clearInterval(this.reconnectionInterval!);
      this.reconnectionInterval = null;

      clearTimeout(this.reconnectionTimeout!);
      this.reconnectionTimeout = null;
    }, 2 * 60 * 1000);
  }
}
