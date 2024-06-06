import ansi from "ansi";
import { RGB, ViewSize, ViewXY } from "../types";
import { overwriteArray, overwriteString } from "../helpers";

export type TOKEN = [string, RGB, RGB];

export class Framebuffer {
  private width: number;
  private height: number;
  private buffer: string[];
  private fgBuffer: RGB[][];
  private bgBuffer: RGB[][];
  private emptyRow: string;
  private emptyFGRow: RGB[];
  private emptyBGRow: RGB[];

  constructor(size: ViewSize) {
    this.width = size.viewWidth;
    this.height = size.viewHeight;
    
    this.emptyRow = " ".repeat(this.width);
    this.emptyFGRow = Array(this.width).fill([255, 255, 255]);
    this.emptyBGRow = Array(this.width).fill([0, 0, 0]);

    this.buffer = Array(this.height).fill(this.emptyRow);
    this.fgBuffer = Array(this.height).fill(this.emptyFGRow);
    this.bgBuffer = Array(this.height).fill(this.emptyBGRow);
  }

  public clear = () => {
    this.buffer.fill(this.emptyRow);
    this.fgBuffer.fill(this.emptyFGRow);
    this.bgBuffer.fill(this.emptyBGRow);
  }
  
  public render = (cursor: ansi.Cursor) => {
    cursor.buffer();
    cursor.goto(1, 1);
    cursor.fg.rgb(...this.fgBuffer[0][0]);
    cursor.bg.rgb(...this.bgBuffer[0][0]);
    let previousFG = this.fgBuffer[0][0];
    let previousBG = this.bgBuffer[0][0];
    for (let j = 0; j < this.buffer.length; j++) {
      // for each row
      for (let i = 0; i < this.buffer[j].length; i++) {
        // for each character
        if (this.fgBuffer[j][i] !== previousFG) {
          cursor.fg.rgb(...this.fgBuffer[j][i]);
          previousFG = this.fgBuffer[j][i];
        }
        if (this.bgBuffer[j][i] !== previousBG) {
          cursor.bg.rgb(...this.bgBuffer[j][i]);
          previousBG = this.bgBuffer[j][i];
        }
        cursor.write(this.buffer[j][i]);
      }
    }
    cursor.flush();
  };

  public resize = (newSize: ViewSize) => {
    this.width = Math.max(newSize.viewWidth, 1);
    this.height = Math.max(newSize.viewHeight, 1);

    this.emptyRow = " ".repeat(this.width);
    this.buffer.length = this.height;
    this.buffer.fill(this.emptyRow);

    this.emptyFGRow = Array(this.width).fill([255, 255, 255]);
    this.fgBuffer.length = this.height;
    this.fgBuffer.fill(this.emptyFGRow);

    this.emptyBGRow = Array(this.width).fill([0, 0, 0]);
    this.bgBuffer.length = this.height;
    this.bgBuffer.fill(this.emptyBGRow);
  };

  public write = (viewXY: ViewXY, tokens: TOKEN[]) => {
    const viewX = Math.floor(viewXY.viewX);
    const viewY = Math.floor(viewXY.viewY);

    // if we're outside the view, skip
    if (viewY < 0 || viewY >= this.buffer.length) {
      return;
    }

    const row = tokens.map(([text]) => text).join("");
    if (viewX + row.length < 0 || viewX >= this.buffer[0].length) {
      return;
    }

    const fgRow: RGB[] = tokens.flatMap((token) => {
      const [text, fg] = token;
      return Array(text.length).fill(fg);
    });
    const bgRow: RGB[] = tokens.flatMap((token) => {
      const [text, _, bg] = token;
      return Array(text.length).fill(bg);
    });

    this.buffer[viewY] = overwriteString(this.buffer[viewY], row, viewX);
    this.fgBuffer[viewY] = overwriteArray<RGB>(this.fgBuffer[viewY], fgRow, viewX);
    this.bgBuffer[viewY] = overwriteArray<RGB>(this.bgBuffer[viewY], bgRow, viewX);
  };

  public getWidth = () => this.width;
  public getHeight = () => this.height;
};
