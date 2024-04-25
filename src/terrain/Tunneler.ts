import { randomInt } from "../Random";
import { Terrain } from "./Terrain";

export enum Direction {
  NORTH = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3
}

export class Tunneler {
  private terrain: Terrain;
  private lifespan: number;
  private tunnelWidth: number;
  private x: number;
  private y: number;
  private direction: Direction;
  
  constructor(terrain: Terrain, tunnelWidth: number, lifespan: number, x: number, y: number, direction: Direction) {
    this.terrain = terrain;
    this.lifespan = lifespan;
    this.tunnelWidth = tunnelWidth;
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  public isDead = (): boolean => {
    return this.lifespan < 2;
  }

  public dig = (): void => {
    if (this.isDead()) {
      return;
    }

    const terrainSize = this.terrain.getSize();
    let tunnelLength: number;
    switch (this.direction) {
      case Direction.NORTH:
        tunnelLength = randomInt(1, Math.min(this.lifespan, this.y));
        this.lifespan -= tunnelLength;
        this.terrain.paintRectangle(
          this.x - Math.floor(this.tunnelWidth / 2),
          this.y - tunnelLength,
          this.tunnelWidth,
          tunnelLength,
          " "
        );
        this.y -= tunnelLength;
        break;
      case Direction.EAST:
        tunnelLength = randomInt(1, Math.min(this.lifespan, terrainSize.width - this.x));
        this.lifespan -= tunnelLength;
        this.terrain.paintRectangle(
          this.x,
          this.y - Math.floor(this.tunnelWidth / 2),
          tunnelLength,
          this.tunnelWidth,
          " "
        );
        this.x += tunnelLength;
        break;
      case Direction.SOUTH:
        tunnelLength = randomInt(1, Math.min(this.lifespan, terrainSize.height - this.y));
        this.lifespan -= tunnelLength;
        this.terrain.paintRectangle(
          this.x - Math.floor(this.tunnelWidth / 2),
          this.y,
          this.tunnelWidth,
          tunnelLength,
          " "
        );
        this.y += tunnelLength;
        break;
      case Direction.WEST:
        tunnelLength = randomInt(1, Math.min(this.lifespan, this.x));
        this.lifespan -= tunnelLength;
        this.terrain.paintRectangle(
          this.x - tunnelLength,
          this.y - Math.floor(this.tunnelWidth / 2),
          tunnelLength,
          this.tunnelWidth,
          " "
        );
        this.x -= tunnelLength;
        break;
    }

    switch (randomInt(0, 1)) {
      case 0:
        this.direction = (this.direction + 1) % 4;
        break;
      case 1:
        this.direction = (this.direction + 3) % 4;
        break;
    }
  }
}