import ansi from "ansi";
import { ViewSize, ViewXY } from "../types"

export const Framebuffer = (size: ViewSize) => {
  let width = size.viewWidth;
  let height = size.viewHeight;
  let emptyRow = " ".repeat(width);
  
  const buffer = Array(height).fill(emptyRow) as string[];
  const resize = (newSize: ViewSize) => {
    width = newSize.viewWidth;
    height = newSize.viewHeight;
    emptyRow = " ".repeat(width);
    buffer.length = height;
    buffer.fill(emptyRow);
  }

  const clear = () => {
    buffer.fill(emptyRow);
  };

  const render = (cursor: ansi.Cursor) => {
    cursor.buffer();
    cursor.goto(1, 1);
    buffer.forEach(row => {
      cursor.write(row);
    });
    cursor.flush();
  };

  const write = (viewXY: ViewXY, text: string) => {
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