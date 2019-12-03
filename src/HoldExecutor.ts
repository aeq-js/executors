import { Executor } from './Executor'

/**
 * This command won't let you execute 2 runs simultaneously.
 * Busy requests will get infinite promise.
 */
export class HoldExecutor extends Executor {
  promise: Promise<any> | null = null

  async run (...parameters: any[]): Promise<any> {
    if (!this.isRunning) {
      this.promise = super.run(...parameters)
      return this.promise
    }
  }
}
