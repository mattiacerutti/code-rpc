import * as vscode from "vscode";

export class IdleManager {
  private timerDuration;
  private timer: NodeJS.Timeout | null = null;

  private lastActivityTimestamp: number;

  private IDLE: boolean = false;
  private eventEmitter = new vscode.EventEmitter<boolean>();

  constructor(timeout: number = 10 * 60 * 1000) {
    if (timeout < 20 * 1000) {
      throw new Error("Timeout can't be less then 20s due to discord-rpc's rate limits");
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
    }, this.timerDuration);
  }

  private resetTimer(): void {
    this.setIdle(false);
    this.startNewTimer();
  }

  private setIdle(value: boolean): void {
    if (this.IDLE === value) {
      return;
    }

    this.lastActivityTimestamp = new Date().getTime();
    
    this.IDLE = value;
    this.eventEmitter.fire(this.IDLE);
  }

  private listenForEvents(callback: () => void): void {
    vscode.window.onDidChangeActiveTextEditor(callback);
    vscode.workspace.onDidChangeTextDocument(callback);
  }
}
