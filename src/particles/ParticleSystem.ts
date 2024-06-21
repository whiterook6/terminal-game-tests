import { randomInt } from "crypto";
import { randomColor, randomFloat } from "../Random";
import { RGB, WorldXY } from "../types";
import { Framebuffer } from "../framebuffer/Framebuffer";

export class ParticleSystem {
  private maxParticles: number;
  private millisecondsLeft: number[];
  private positions: WorldXY[];
  private velocities: WorldXY[];
  private colors: RGB[];
  private topLeft: WorldXY;
  private bottomRight: WorldXY;

  constructor(count: number, width: number, height: number) {
    this.topLeft = { worldX: 1, worldY: 1 };
    this.bottomRight = { worldX: width - 1, worldY: height - 1 };
    this.maxParticles = count;

    this.positions = Array.apply(null, { length: this.maxParticles }).map(
      (_, i) => ({
        worldX: randomInt(this.topLeft.worldX, this.bottomRight.worldX),
        worldY: randomInt(this.topLeft.worldY, this.bottomRight.worldY),
      })
    );
    this.velocities = Array.apply(null, {
      length: this.maxParticles,
    }).map((_, i) => ({
      worldX: randomFloat(-4, 4),
      worldY: randomFloat(-2, 2),
    }));
    this.colors = Array.apply(null, { length: this.maxParticles }).map(() =>
      randomColor()
    );
    this.millisecondsLeft = new Array(this.maxParticles).fill(0);
  }

  public spawn = ({
    worldX,
    worldY,
    worldDX,
    worldDY,
    millisecondsLeft,
    color,
  }: {
    worldX: number;
    worldY: number;
    worldDX: number;
    worldDY: number;
    millisecondsLeft: number;
    color: RGB;
  }) => {
    for (let i = 0; i < this.maxParticles; i++) {
      if (this.millisecondsLeft[i] <= 0) {
        this.positions[i] = { worldX, worldY };
        this.velocities[i] = { worldX: worldDX, worldY: worldDY };
        this.millisecondsLeft[i] = millisecondsLeft;
        this.colors[i] = color;
        break;
      }
    }
  };

  public update = (deltaTMS: number) => {
    for (let i = 0; i < this.maxParticles; i++) {
      if (this.millisecondsLeft[i] <= 0) {
        continue;
      }

      this.millisecondsLeft[i] -= deltaTMS;
      this.positions[i].worldX += this.velocities[i].worldX * deltaTMS / 1000;
      this.positions[i].worldY += this.velocities[i].worldY * deltaTMS / 1000;

      this.velocities[i].worldY += deltaTMS / 1000;

      if (this.positions[i].worldX < this.topLeft.worldX) {
        this.positions[i].worldX = this.topLeft.worldX;
        this.velocities[i].worldX *= -1;
      } else if (this.positions[i].worldX > this.bottomRight.worldX) {
        this.positions[i].worldX = this.bottomRight.worldX;
        this.velocities[i].worldX *= -1;
      }

      if (this.positions[i].worldY < this.topLeft.worldY) {
        this.positions[i].worldY = this.topLeft.worldY;
        this.velocities[i].worldY *= -0.8;
      } else if (this.positions[i].worldY > this.bottomRight.worldY) {
        this.positions[i].worldY = this.bottomRight.worldY;
        this.velocities[i].worldY *= -0.8;
      }
    }
  }

  public render = (framebuffer: Framebuffer) => {
    for (let i = 0; i < this.maxParticles; i++) {
      if (this.millisecondsLeft[i] <= 0) {
        continue;
      }
      
      framebuffer.write({
        viewX: Math.floor(this.positions[i].worldX),
        viewY: Math.floor(this.positions[i].worldY),
      }, [['█', ...this.colors[i]]]);
    }
  }
}
