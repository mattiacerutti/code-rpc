import * as vscode from "vscode";
import PresenceManager from "./services/presence-manager";

export function activate(context: vscode.ExtensionContext) {
  //Register command "testConnection"
  console.log("Code RPC extension activated");

  const APP_ID = "1343552289717096488";

  const presenceManager = new PresenceManager(APP_ID);
  presenceManager.connectAndStartUpdating();
}
