import ansi from "ansi";
import { ViewSize, ViewXY } from "../types"

export type RGB = [number, number, number];
export type TOKEN = [string, RGB, RGB];

export const Framebuffer = (size: ViewSize) => {
  let width = size.viewWidth;
  let height = size.viewHeight;
  let emptyRow = " ".repeat(width);
  const buffer = Array(height).fill(emptyRow) as string[];

  let emptyFGRow = Array(width).fill([255, 255, 255]) as RGB[];
  const fgBuffer = Array(height).fill(emptyFGRow) as RGB[][];

  let emptyBGRow = Array(width).fill([0, 0, 0]) as RGB[];
  const bgBuffer = Array(height).fill(emptyBGRow) as RGB[][];

  const clear = () => {
    buffer.fill(emptyRow);
    fgBuffer.fill(emptyFGRow);
    bgBuffer.fill(emptyBGRow);
  };

  const render = (cursor: ansi.Cursor) => {
    cursor.buffer();
    cursor.goto(1, 1);
    cursor.fg.rgb(...fgBuffer[0][0]);
    cursor.bg.rgb(...bgBuffer[0][0]);
    let previousFG = fgBuffer[0][0];
    let previousBG = bgBuffer[0][0];
    for (let j = 0; j < buffer.length; j++){ // for each row
      for (let i = 0; i < buffer[j].length; i++){ // for each character
        if (fgBuffer[j][i] !== previousFG){
          cursor.fg.rgb(...fgBuffer[j][i]);
          previousFG = fgBuffer[j][i];
        }
        if (bgBuffer[j][i] !== previousBG){
          cursor.bg.rgb(...bgBuffer[j][i]);
          previousBG = bgBuffer[j][i];
        }
        cursor.write(buffer[j][i]);
      }
    }
    cursor.flush();
  };
  
  const resize = (newSize: ViewSize) => {
    width = newSize.viewWidth;
    height = newSize.viewHeight;

    emptyRow = " ".repeat(width);
    buffer.length = height;
    buffer.fill(emptyRow);

    emptyFGRow = Array(width).fill([255, 255, 255]);
    fgBuffer.length = height;
    fgBuffer.fill(emptyFGRow);

    emptyBGRow = Array(width).fill([0, 0, 0]);
    bgBuffer.length = height;
    bgBuffer.fill(emptyBGRow);
  };

  const write = (
    viewXY: ViewXY,
    [text, fg, bg]: TOKEN
  ) => {
    const viewX = Math.floor(viewXY.viewX);
    const viewY = Math.floor(viewXY.viewY);

    // if we're outside the view, skip
    if (viewY < 0 || viewY >= buffer.length) {
      return;
    } else if (viewX > width || viewX + text.length < 0) {
      return;
    }

    const row = buffer[viewY];
    if (!row){
      throw new Error(`Row ${viewY} does not exist`);
    }

    let leftSlice: number, rightSlice: number | undefined;
    let leftPad: string;
    let rightPad: string;

    // figure out how much of each row to include, and how much to pad each row
    // left side
    if (viewX < 0){
      leftSlice = -viewX;
      leftPad = "";
    } else if (viewX > 0){
      leftSlice = 0;
      leftPad = row.substring(0, viewX);
    } else {
      leftSlice = 0;
      leftPad = "";
    }

    // if the text is too wide, crop it
    if (viewX + text.length >= width){
      rightPad = "";
      rightSlice = width - viewX;
    } else if (viewX + text.length < width){ // need extra padding on the right
      rightSlice = text.length;
      rightPad = row.substring(viewX + text.length);
    } else {
      rightSlice = width - viewX;
      rightPad = "";
    }

    buffer[viewY] = leftPad + text.slice(leftSlice, rightSlice) + rightPad;
    fgBuffer[viewY] = [
      ...fgBuffer[viewY].slice(0, viewX),
      ...Array(rightSlice - leftSlice).fill(fg),
      ...fgBuffer[viewY].slice(viewX + text.length)
    ];
    bgBuffer[viewY] = [
      ...bgBuffer[viewY].slice(0, viewX),
      ...Array(rightSlice - leftSlice).fill(bg),
      ...bgBuffer[viewY].slice(viewX + text.length)
    ];
  }

  return {
    clear,
    render,
    resize,
    write,
    width: () => buffer.length > 0 ? buffer[0].length : 0,
    height: () => buffer.length,
  }
}