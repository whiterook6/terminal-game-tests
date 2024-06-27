import { randomInt } from "crypto";
import { randomColor, randomFloat } from "../Random";
import { RGB, WorldXY } from "../types";
import { Framebuffer } from "../framebuffer/Framebuffer";
import { Vector, add, scale } from "../Vector";

export class ParticleSystem {
  private maxParticles: number;
  private millisecondsLeft: number[];
  private positions: Vector[];
  private velocities: Vector[];
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
        this.positions[i] = [ worldX, worldY ];
        this.velocities[i] = [ worldDX, worldDY ];
        this.millisecondsLeft[i] = millisecondsLeft;
        this.colors[i] = color;
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
      // this.positions[i].worldX += this.velocities[i].worldX * deltaTMS / 1000;
      // this.positions[i].worldY += this.velocities[i].worldY * deltaTMS / 1000;
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
    for (let i = 0; i < this.maxParticles; i++) {
      if (this.millisecondsLeft[i] <= 0) {
        continue;
      }

      const position = this.positions[i];

      let character;
      if (Math.round(position[0]) > position[0]){
        if (Math.round(position[1]) > position[1]){
          character = "⠠";
        } else {
          character = "⠈";
        }
      } else if (Math.round(position[1]) > position[1]){
        character = "⠄";
      } else {
        character = "⠁";
      }
      
      framebuffer.write({
        viewX: Math.floor(this.positions[i][0]),
        viewY: Math.floor(this.positions[i][1]),
      }, [[character, ...this.colors[i]]]);
    }
  }
}
