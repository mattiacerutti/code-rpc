import * as vscode from "vscode";
import PresenceManager from "./presence-manager";

enum CommandId {
  CONNECT = "code-rpc.connect",
  DISCONNECT = "code-rpc.disconnect",
}


export class CommandManager {
  private commands: Map<string, (...args: any[]) => any> = new Map();
  
  constructor(private context: vscode.ExtensionContext, private presenceManager: PresenceManager) {
    this.registerCommands();
  }

  private registerCommands(): void {
    // Connect command
    this.registerCommand(CommandId.CONNECT, () => {
      this.presenceManager.connectAndStartUpdating();
      //TODO: Add error handling
      vscode.window.showInformationMessage("Connected to Discord RPC");
    });

    // Disconnect command
    this.registerCommand(CommandId.DISCONNECT, () => {
      this.presenceManager.stopAndDisconnect();
      vscode.window.showInformationMessage("Disconnected from Discord RPC");
    });
  }

  private registerCommand(commandId: string, handler: (...args: any[]) => any): void {
    const disposable = vscode.commands.registerCommand(commandId, handler);
    this.context.subscriptions.push(disposable);
    this.commands.set(commandId, handler);
  }
} 
