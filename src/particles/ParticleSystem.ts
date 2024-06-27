import { randomInt } from "crypto";
import { randomColor, randomFloat } from "../Random";
import { RGB, WorldXY } from "../types";
import { Framebuffer } from "../framebuffer/Framebuffer";
import { Vector, add, floor, scale } from "../Vector";

export class ParticleSystem {
  private maxParticles: number;
  private millisecondsLeft: number[];
  private positions: Vector[];
  private velocities: Vector[];
  private characters: string[];
  private colors: RGB[];
  private topLeft: WorldXY;
  private bottomRight: WorldXY;

  constructor(count: number, width: number, height: number) {
    this.topLeft = { worldX: 1, worldY: 1 };
    this.bottomRight = { worldX: width - 1, worldY: height - 1 };
    this.maxParticles = count;

    this.positions = new Array<Vector>(this.maxParticles).fill([0, 0]);
    this.velocities = new Array<Vector>(this.maxParticles).fill([0, 0]);
    this.colors = new Array<RGB>(this.maxParticles).fill([0, 0, 0]);
    this.millisecondsLeft = new Array<number>(this.maxParticles).fill(0);
    this.characters = new Array<string>(this.maxParticles).fill(".");
  }

  public spawn = ({
    worldX,
    worldY,
    worldDX,
    worldDY,
    millisecondsLeft,
    color,
    character
  }: {
    worldX: number;
    worldY: number;
    worldDX: number;
    worldDY: number;
    millisecondsLeft: number;
    color: RGB;
    character: string;
  }) => {
    for (let i = 0; i < this.maxParticles; i++) {
      if (this.millisecondsLeft[i] <= 0) {
        this.positions[i] = [ worldX, worldY ];
        this.velocities[i] = [ worldDX, worldDY ];
        this.millisecondsLeft[i] = millisecondsLeft;
        this.colors[i] = color;
        this.characters[i] = character;
        break;
      }
    }
  };

  public update = (deltaTMS: number) => {
    const deltaPosition: Vector = [0, 0];
    for (let i = 0; i < this.maxParticles; i++) {
      if (this.millisecondsLeft[i] <= 0) {
        continue;
      }

      this.millisecondsLeft[i] -= deltaTMS;
      scale(this.velocities[i], deltaTMS / 1000, deltaPosition);
      add(this.positions[i], deltaPosition, this.positions[i]);

      this.velocities[i][1] += deltaTMS / 1000;

      if (this.positions[i][0] < this.topLeft.worldX) {
        this.positions[i][0] = this.topLeft.worldX;
        this.velocities[i][0] *= -0.9;
      } else if (this.positions[i][0] > this.bottomRight.worldX) {
        this.positions[i][0] = this.bottomRight.worldX;
        this.velocities[i][0] *= -0.9;
      }
      
      if (this.positions[i][1] < this.topLeft.worldY) {
        this.positions[i][1] = this.topLeft.worldY;
        this.velocities[i][1] *= -0.9;
      } else if (this.positions[i][1] > this.bottomRight.worldY) {
        this.positions[i][1] = this.bottomRight.worldY;
        this.velocities[i][1] *= -0.9;
      }
    }
  }

  public render = (framebuffer: Framebuffer) => {
    const floorPosition: Vector = [0, 0];
    for (let i = 0; i < this.maxParticles; i++) {
      const millisecondsLeft = this.millisecondsLeft[i];
      if (millisecondsLeft <= 0) {
        continue;
      }
        
      floor(this.positions[i], floorPosition);
      framebuffer.write({
        viewX: Math.floor(floorPosition[0]),
        viewY: Math.floor(floorPosition[1]),
      }, [[this.characters[i], ...this.colors[i]]]);
    }
  }
}
