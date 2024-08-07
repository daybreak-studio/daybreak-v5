/**
 * Using moving average to track if a value is increasing
 */
export class AccelerationDetector {
  private velocityHistory;
  private lastAvgedVel = 0;
  private avgVel = 0;

  constructor(bufferSize = 10) {
    this.velocityHistory = new Array(bufferSize);
    for (let i = 0; i < this.velocityHistory.length; i++) {
      this.velocityHistory[i] = 0;
    }
  }

  advance(velocity: number) {
    // push the buffer tem down one index
    for (let i = this.velocityHistory.length - 1; i > 0; i--) {
      this.velocityHistory[i] = this.velocityHistory[i - 1];
    }
    // updat the latest
    this.velocityHistory[0] = velocity;

    // calculate the moving average
    let avgVel = 0;
    for (const vel of this.velocityHistory) {
      avgVel += vel;
    }
    avgVel /= this.velocityHistory.length;
    this.lastAvgedVel = this.avgVel;
    this.avgVel = avgVel;

    const isAccelerating = Math.abs(this.avgVel) > Math.abs(this.lastAvgedVel);

    return isAccelerating;
  }
}
