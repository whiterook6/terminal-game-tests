export class Terrain {
  private rows: string[];
  private height: number;
  private width: number;

  constructor(width: number, height: number, startingTile: string) {
    this.width = width;
    this.height = height;
    this.rows = Array(height).fill(startingTile.repeat(width));
  }

  public getSize = () => {
    return {
      width: this.width,
      height: this.height
    };
  }

  public getMap(): string[] {
    return this.rows;
  }

  /**
   * @param x 0 offset x coordinate
   * @param y 0 offset y coordinate
   * @param width 
   * @param height 
   * @param tile A single character
   */
  public paintRectangle(x: number, y: number, width: number, height: number, tile: string): void {
    if (x > this.width || y > this.height) {
      return;
    } else if (x + width < 0 || y + height < 0) {
      return;
    } else if (tile.length !== 1){
      return;
    }

    const leftSlice = Math.max(Math.min(x, this.width), 0);
    const rightSlice = Math.max(Math.min(x + width, this.width), 0);
    const newRowData = tile.repeat(rightSlice - leftSlice);

    for (let row = y; row < y + height; row++) {
      if (row < 0) {
        continue;
      }
      if (row >= this.height) {
        break;
      }
      this.rows[row] = `${this.rows[row].slice(0, leftSlice)}${newRowData}${this.rows[row].slice(rightSlice)}`;
    }
  }
}