import * as vscode from "vscode";
import PresenceManager from "./services/presence-manager";

export function activate(context: vscode.ExtensionContext) {
  //Register command "testConnection"
  console.log("Code RPC extension activated");

  const presenceManager = new PresenceManager("1342149603851501578");
  presenceManager.connectAndStartUpdating();
}
