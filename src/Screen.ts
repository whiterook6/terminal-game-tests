export type ScreenSize = {
    screenWidth: number;
    screenHeight: number;
};

export type ScreenXY = {
    screenX: number;
    screenY: number;
};

export type WorldXY = {
    worldX: number;
    worldY: number;
};

export type OffsetXY = {
    offsetX: number;
    offsetY: number;
};

export const MAX_ZOOM = 8;
export const MIN_ZOOM = 1/8;

export class Screen {
    private columns: number;
    private rows: number;
    private offset: OffsetXY = {
        offsetX: 0,
        offsetY: 0
    };
    listeners: ((screensize: ScreenSize) => void)[] = [];

    /**
     * Smaller Zoom means smaller things closer together on screen, so a wider view, like the view from a satellite. Larger zoom means larger things farther apart on screen, so a narrower view, like the view from a drone.
     */
    private zoom: number = 1;

    constructor(){
        this.columns = process.stdout.columns;
        this.rows = process.stdout.rows;
        process.stdout.addListener("resize", this.onResize);
    }

    public destroy = () => {
        process.stdout.removeListener("resize", this.onResize);
    }

    public addListener = (callback: (screensize: ScreenSize) => void) => {
        this.listeners.push(callback);
    }

    public removeListener = (callback: (screensize: ScreenSize) => void) => {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    /**
     * @param offset How far to pan the screen Up and Left (or north and west). Contents in the world
     * will move down and right.
     */
    public panView = ({offsetX: newOffsetX, offsetY: newOffsetY}: OffsetXY) => {
        const {
            offsetX: oldOffsetX,
            offsetY: oldOffsetY
        } = this.offset;

        this.offset = {
            offsetX: oldOffsetX + newOffsetX,
            offsetY: oldOffsetY + newOffsetY,
        }
    }

    /**
     * Zoom in or out around a specific point in screen space
     * @param screenXY where on the screen to zoom
     * @param newZoom the new zoom factor. Larger zooms mean things are farther apart and less of the world is visible.
     */
    public zoomView = (screenXY: ScreenXY, newZoom: number) => {
        const worldPosition = this.getWorldPosition(screenXY);
        this.offset = {
            offsetX: screenXY.screenX * (this.zoom / newZoom) - worldPosition.worldX,
            offsetY: screenXY.screenY * (this.zoom / newZoom) - worldPosition.worldY,
        };
        this.zoom = newZoom;
    }

    public getScreenSize = (): ScreenSize => ({
        screenWidth: this.columns,
        screenHeight: this.rows
    });

    /**
     * Gets the screen position of the world coordinates, taking into account
     * the screen offset and the current zoom. If the coordinates are negative or very large,
     * the screen position might be off screen.
     * @param param0 
     */
    public getScreenPosition = ({worldX, worldY}: WorldXY): ScreenXY => {
        const {
            offsetX,
            offsetY
        } = this.offset;

        return {
            screenX: (worldX + offsetX) * this.zoom,
            screenY: (worldY + offsetY) * this.zoom,
        }
    }

    /**
     * Get the world position of the screen coordinates. You can supply a screen position that
     * is technically off-screen.
     */
    public getWorldPosition = ({screenX, screenY}: ScreenXY): WorldXY => {
        const {
            offsetX,
            offsetY
        } = this.offset;

        return {
            worldX: (screenX / this.zoom) - offsetX,
            worldY: (screenY / this.zoom) - offsetY
        };
    }

    /**
     * Get the top left of the screen in world coordinates.
     * Equivalent to this.getWorldPosition(0, 0)
     */
    public getWorldTopLeft = () => {
        return this.getWorldPosition({screenX: 0, screenY: 0});
    }

    /**
     * Get the bottom right of the screen in world coordinates.
     * Equivalent to this.getWorldPosition(columns, rows)
     */
    public getWorldBottomRight = () => {
        return this.getWorldPosition({
            screenX: this.columns,
            screenY: this.rows
        });
    }

    /**
     * Get the center of the screen in world coordinates.
     * Equivalent to this.getWorldPosition(columns / 2, rows / 2)
     */
    public getWorldCenter = () => {
        return this.getWorldPosition({
            screenX: this.columns / 2,
            screenY: this.rows / 2
        });
    }

    private onResize = () => {
        this.columns = process.stdout.columns;
        this.rows = process.stdout.rows;

        for (const listener of this.listeners){
            listener({
                screenWidth: this.columns,
                screenHeight: this.rows
            });
        }
    }
}