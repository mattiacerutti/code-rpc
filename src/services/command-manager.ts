import * as vscode from "vscode";
import PresenceManager from "./presence-manager";
import {EXTENSION_NAME} from "../constants";

enum CommandId {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
}

export class CommandManager {
  private commands: Map<string, (...args: any[]) => any> = new Map();

  constructor(private context: vscode.ExtensionContext, private presenceManager: PresenceManager) {
    this.registerCommands();

    this.updateCommandAvailability(CommandId.CONNECT, true);

    this.setupPresenceListeners();
  }

  private registerCommands(): void {
    // Connect command
    this.registerCommand(`${EXTENSION_NAME}.${CommandId.CONNECT}`, async () => {
      try {
        await this.presenceManager.connectAndStartUpdating();
        vscode.window.showInformationMessage("Connected to Discord RPC");
      } catch (error) {
        vscode.window.showErrorMessage("Error connecting to Discord RPC. Please check if you have Discord running.");
      }
    });

    // Disconnect command
    this.registerCommand(`${EXTENSION_NAME}.${CommandId.DISCONNECT}`, async () => {
      try {
        await this.presenceManager.stopAndDisconnect();
        vscode.window.showInformationMessage("Disconnected from Discord RPC");
      } catch (error) {
        vscode.window.showErrorMessage("Error disconnecting from Discord RPC. Please try again.");
      }
    });
  }

  private registerCommand(commandId: string, handler: (...args: any[]) => any): void {
    const disposable = vscode.commands.registerCommand(commandId, handler);
    this.context.subscriptions.push(disposable);
    this.commands.set(commandId, handler);
  }

  private updateCommandAvailability(commandId: string, isEnabled: boolean): void {
    vscode.commands.executeCommand("setContext", `${EXTENSION_NAME}.${commandId}`, isEnabled);
  }

  private setupPresenceListeners(): void {
    this.presenceManager.on("connected", () => {
      this.updateCommandAvailability(CommandId.CONNECT, false);
      this.updateCommandAvailability(CommandId.DISCONNECT, true);
    });

    this.presenceManager.on("disconnected", () => {
      this.updateCommandAvailability(CommandId.CONNECT, true);
      this.updateCommandAvailability(CommandId.DISCONNECT, false);
    });
  }
}
