import * as vscode from "vscode";

export class IdleManager {
  private IDLE_TIMEOUT;
  private timer: NodeJS.Timeout | null = null;

  private IDLE: boolean = false;
  private eventEmitter = new vscode.EventEmitter<boolean>();

  constructor(timeout: number = 10 * 1000) {
    if (timeout < 0 * 1000) { //TODO: Value only for testing. Change it.
      throw new Error("Timeout can't be less then 20s due to discord-rpc ratelimit");
    }
    this.IDLE_TIMEOUT = timeout;
    this.start();
    this.listenForEvents(() => this.reset());
  }

  public isIdle(): boolean {
    return this.IDLE;
  }

  public onIdleChange(listener: (isIdle: boolean) => void): vscode.Disposable {
    return this.eventEmitter.event(listener);
  }

  private start(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.setIdle(true);
    }, this.IDLE_TIMEOUT);
  }

  private reset(): void {
    this.setIdle(false);
    this.start();
  }

  private setIdle(value: boolean): void {
    if (this.IDLE === value) {
      return;
    }
    this.IDLE = value;
    this.eventEmitter.fire(this.IDLE);
  }

  private listenForEvents(callback: () => void): void {
    vscode.window.onDidChangeActiveTextEditor(callback);
    vscode.workspace.onDidChangeTextDocument(callback);
  }
}
