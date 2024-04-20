import { OffsetXY, ViewSize } from "./types";

/**
 * 
 * @param rows Must be a rectangular array of rows. Each row must be the same length.
 * @param offset How much to push the map down and right
 * @param viewSize How wide and tall the view should be
 * @returns the map contents, in rows, including any blank space needed to fill the view
 */
export const Map = (rows: string[], offset: OffsetXY, viewSize: ViewSize): string[] => {
    const { offsetX, offsetY } = offset;
    const { viewWidth, viewHeight } = viewSize;
    const emptyRow = "-".repeat(viewWidth);

    const mapHeight = rows.length;
    if (mapHeight === 0 || offsetY >= mapHeight){
        return Array(viewHeight).fill(emptyRow);
    }

    const mapWidth = rows[0].length;
    if (mapWidth === 0){
        return Array(viewHeight).fill(emptyRow);
    }

    let leftSlice: number, rightSlice: number | undefined;
    let leftPad: string;
    let rightPad: string;

    // figure out how much of each row to include, and how much to pad each row
    // left side
    if (offsetX === 0){
        leftSlice = 0;
        leftPad = "";
    } else if (offsetX > 0){
        leftSlice = 0;
        leftPad = "-".repeat(offsetX);
    } else {
        leftSlice = -offsetX;
        leftPad = ""
    }

    // same for the right side
    if (offsetX + mapWidth === viewWidth){
        rightSlice = undefined;
        rightPad = "";
    } else if (offsetX + mapWidth < viewWidth){ // need extra padding on the right
        rightSlice = undefined;
        rightPad = "-".repeat(viewWidth - offsetX - mapWidth);
    } else { // need to slice the right side
        rightSlice = viewWidth - offsetX;
        rightPad = "";
    }

    const output = [];
    for (let i = 0; i < viewHeight; i++){
        if (i < offsetY || i >= offsetY + mapHeight){
            output.push(emptyRow);
        } else {
            const row = rows[i - offsetY];
            const viewRow = leftPad + row.slice(leftSlice, rightSlice) + rightPad;
            output.push(viewRow);
        }
    }
    return output;
}