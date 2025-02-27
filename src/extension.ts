import * as vscode from "vscode";
import PresenceManager from "./services/presence-manager";
import { CommandManager } from "./services/command-manager";

export function activate(context: vscode.ExtensionContext) {
  console.log("Code RPC extension activated");

  const APP_ID = "1343552289717096488";

  const presenceManager = new PresenceManager(APP_ID);
  presenceManager.connectAndStartUpdating();

  new CommandManager(context, presenceManager);

}
