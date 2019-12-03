export class Debouncer {
  command: Function
  time: number = 1
  id: any = null

  constructor (command: () => any, time: number) {
    this.command = command
    this.time = time
  }

  public start () {
    if (!this.id) {
      this.id = setTimeout(this.command, this.time)
    }
  }

  public refresh () {
    this.stop()
    this.start()
  }

  public stop () {
    if (this.id) {
      clearTimeout(this.id)
    }
    this.id = null
  }
}
