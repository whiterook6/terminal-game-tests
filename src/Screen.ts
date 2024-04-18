export interface IScreenCoords {
    x: number;
    y: number;
}

export class Screen {
    private columns: number;
    private rows: number;
    private xOffset: number = 0;
    private yOffset: number = 0;

    /* Smaller Zoom means smaller things, so a wider view. Larger zoom means closer in. */
    private zoom: number = 1;

    constructor(){
        this.columns = process.stdout.columns;
        this.rows = process.stdout.rows;
        process.stdout.addListener("resize", this.onResize);
    }

    public destroy = () => {
        process.stdout.removeListener("resize", this.onResize);
    }

    public moveView = (x: number, y: number) => {
        this.xOffset = x;
        this.yOffset = y;
    }

    public setZoom = (zoom: number) => {
        this.zoom = zoom;
    }

    public getScreenPosition = (worldX: number, worldY: number) => {

        // take into account the zoom
        return {
            x: (worldX - this.xOffset) * this.zoom,
            y: (worldY - this.yOffset) * this.zoom
        }
    }

    public getWorldPosition = (screenX: number, screenY: number) => {
        // take into account the zoom
        return {
            x: screenX + this.xOffset / this.zoom,
            y: screenY + this.yOffset / this.zoom
        }
    }

    public getScreenBoundsInWorld = () => {
        return {
            left: this.xOffset,
            right: this.xOffset + this.columns / this.zoom,
            top: this.yOffset,
            bottom: this.yOffset + this.rows / this.zoom
        };
    }

    private onResize = () => {
        this.columns = process.stdout.columns;
        this.rows = process.stdout.rows;
    }
}