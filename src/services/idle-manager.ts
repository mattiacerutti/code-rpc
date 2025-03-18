import * as vscode from "vscode";
import { MIN_IDLE_TIMEOUT, DEFAULT_IDLE_TIMEOUT } from "../constants";
import { SettingsManager } from "./settings-manager";

export class IdleManager {
  private timerDuration: number;
  private timer: NodeJS.Timeout | null = null;

  private lastActivityTimestamp: number;

  private IDLE: boolean = false;
  private eventEmitter = new vscode.EventEmitter<boolean>();

  constructor(timeout: number = DEFAULT_IDLE_TIMEOUT) {
    if (timeout < MIN_IDLE_TIMEOUT ) {
      throw new Error(`Timeout can't be less then ${MIN_IDLE_TIMEOUT}s due to discord-rpc's rate limits`);
    }
    this.timerDuration = timeout;
    this.startNewTimer();
    this.listenForEvents(() => this.resetTimer());
    this.lastActivityTimestamp = new Date().getTime();
  }

  public isIdle(): boolean {
    return this.IDLE;
  }

  public getLastActivityTimestamp(): number {
    return this.lastActivityTimestamp;
  }

  public onIdleChange(listener: (isIdle: boolean) => void): vscode.Disposable {
    return this.eventEmitter.event(listener);
  }

  private startNewTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.setIdle(true);
    }, this.timerDuration * 1000);
  }

  public resetTimer(): void {
    this.setIdle(false);
    this.startNewTimer();
  }

  private setIdle(value: boolean): void {
    if (this.IDLE === value) {
      return;
    }

    if (SettingsManager.instance.getResetElapsedTimeOnIdle() === true) {
      this.lastActivityTimestamp = new Date().getTime();
    }
    
    this.IDLE = value;
    this.eventEmitter.fire(this.IDLE);
  }

  private listenForEvents(callback: () => void): void {
    vscode.window.onDidChangeActiveTextEditor(callback);
    vscode.workspace.onDidChangeTextDocument(callback);
  }
}
