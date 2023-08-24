import Vector2 = Phaser.Math.Vector2;

/**
 * The configuration for the second order dynamics instance
 */
export interface Config {
  /**
   * The response rate of the dynamics.
   *
   * Higher values will result shorter response times.
   */
  response: number;

  /**
   * The dampening of the dynamics.
   *
   * Higher values will result in less overshoot and oscillation.
   */
  dampen: number;

  /**
   * The eagerness of the dynamics.
   *
   * Higher values will result in more overshoot and oscillation, negative values will result in anticipation.
   */
  eager: number;
}

export default class SecondOrderDynamics {
  // previous input
  private xp: Vector2;

  // state variables
  private y: Vector2;
  private yd: Vector2;

  // dynamics constants
  private k1: number;
  private k2: number;
  private k3: number;

  /**
   * Creates a new second order dynamics object
   * @param xi initial state
   * @param config dynamics configuration
   */
  constructor(xi: Vector2, config?: Config) {
    config = config ?? {
      response: 1,
      dampen: 1,
      eager: 1,
    };

    // compute constants
    this.k1 = SecondOrderDynamics.calcK1(config);
    this.k2 = SecondOrderDynamics.calcK2(config);
    this.k3 = SecondOrderDynamics.calcK3(config);

    // initialize state variables
    this.xp = xi.clone();
    this.y = xi.clone();
    this.yd = Vector2.ZERO.clone();
  }

  /**
   * Updates the dynamics object
   * @param deltaTime Delta time
   * @param target Target value
   * @param change Target's rate of change. Leave null to estimate from previous value
   * @returns The calculated value
   */
  public update(
    deltaTime: number,
    target: Vector2,
    change: Vector2 | null = null
  ): Vector2 {
    if (change === null) {
      // estimate velocity
      change = new Vector2(
        (target.x - this.xp.x) / deltaTime,
        (target.y - this.xp.y) / deltaTime
      );

      this.xp.x = target.x;
      this.xp.y = target.y;
    }

    // clamp k2 to guarantee stability without jitter
    const k2Stable = Math.max(
      this.k2,
      (deltaTime * deltaTime) / 2 + (deltaTime * this.k1) / 2,
      deltaTime * this.k1
    );

    // integrate position by velocity
    this.y.x = this.y.x + deltaTime * this.yd.x;
    this.y.y = this.y.y + deltaTime * this.yd.y;

    // integrate velocity by acceleration
    this.yd.x =
      this.yd.x +
      (deltaTime *
        (target.x + this.k3 * change.x - this.y.x - this.k1 * this.yd.x)) /
        k2Stable;

    this.yd.y =
      this.yd.y +
      (deltaTime *
        (target.y + this.k3 * change.y - this.y.y - this.k1 * this.yd.y)) /
        k2Stable;

    return this.y;
  }

  public setDynamics(config: Config): void {
    // compute constants
    this.k1 = SecondOrderDynamics.calcK1(config);
    this.k2 = SecondOrderDynamics.calcK2(config);
    this.k3 = SecondOrderDynamics.calcK3(config);
  }

  public reset(xi: Vector2) {
    this.xp.copy(xi);
    this.y.copy(xi);
    this.yd.set(0, 0);
  }

  private static calcK1(config: Config): number {
    return config.dampen / (Math.PI * config.response);
  }

  private static calcK2(config: Config): number {
    return (
      1 / (2 * Math.PI * config.response * (2 * Math.PI * config.response))
    );
  }

  private static calcK3(config: Config): number {
    return (config.eager * config.dampen) / (2 * Math.PI * config.response);
  }
}
