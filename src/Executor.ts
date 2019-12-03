export type CommandCallback = (...args: any[]) => Promise<any>

export class Executor {
  protected readonly cb: CommandCallback

  /**
   * Currently running cbs
   */
  public runCount: number = 0 //

  /**
   * Total count of run calls
   */
  public wasRunCount: number = 0 //

  /**
   * Last executor run happened without an error
   */
  public wasLastRunFine: boolean = false //

  /**
   * Executor was run at least once
   */
  public wasRun: boolean = false

  /**
   * Executor was run without throwing error at least once
   */
  public wasRunFine: boolean = false

  /**
   * Executor was run with thrown error at least once
   */
  public wasRunBad: boolean = false

  constructor (cb: CommandCallback) {
    this.cb = cb
  }

  static createAndRun (cb: CommandCallback): Executor {
    const executor = new Executor(cb)
    executor.run()
    return executor
  }

  /**
   * Command from this executor is currently running.
   */
  public get isRunning (): boolean {
    return !!this.runCount
  }

  /**
   * @param parameters Arguments, will be passed down to cb.
   * @returns {Promise<any>} Promise result is formed from whatever you returned from cb.
   */
  public run (...parameters: any[]): Promise<any> {
    this.beforeRun()
    const promise = this.cb(...parameters)
    this.afterRun(promise)
    return promise
  }

  protected beforeRun (): void {
    this.runCount++
  }

  protected afterRun (promise: Promise<any>): void {
    promise.then(() => {
      this.runCount--
      this.setRunResultFlags(true)
      this.wasRunCount++
    })
    promise.catch(() => {
      this.runCount--
      this.setRunResultFlags(false)
      this.wasRunCount++
    })
  }

  protected setRunResultFlags (success: boolean): void {
    this.wasRun = true
    this.wasLastRunFine = success
    if (success) {
      this.wasRunFine = true
    }
    if (!success) {
      this.wasRunBad = true
    }
  }
}
