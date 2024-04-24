import { OffsetXY, ViewSize, ViewXY, WorldXY } from "../types";

export const MAX_ZOOM = 8;
export const MIN_ZOOM = 1/8;

export class View {
    private offset: OffsetXY;
    private size: ViewSize;

    /**
     * Smaller Zoom means smaller things closer together on view, so a wider view, like the view from a satellite. Larger zoom means larger things farther apart on view, so a narrower view, like the view from a drone.
     */
    private zoom: number;

    constructor (
        offset: OffsetXY,
        size: ViewSize,
        zoom: number = 1
    ){
        this.offset = {...offset};
        this.size = {...size};
        this.zoom = zoom;
    }

    public setOffset = (offset: OffsetXY) => {
        this.offset = {...offset};
    }

    public getOffset = (): OffsetXY => {
        return {...this.offset};
    }

    public setSize = (size: ViewSize) => {
        this.size = {...size};
    }

    public getSize = (): ViewSize => {
        return {...this.size};
    }

    /**
     * @param offset How far to pan the view Up and Left (or north and west). Contents in the world
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
     * Zoom in or out around a specific point in view space
     * @param viewXY where on the view to zoom
     * @param newZoom the new zoom factor. Larger zooms mean things are farther apart and less of the world is visible. Clamped from 1/8 to 8
     */
    public zoomView = (viewXY: ViewXY, newZoom: number) => {
        const safeNewZoom = Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
        if (safeNewZoom === this.zoom) {
            return;
        }

        const worldPosition = this.getWorldPosition(viewXY);
        this.offset = {
            offsetX: viewXY.viewX / safeNewZoom - worldPosition.worldX,
            offsetY: viewXY.viewY / safeNewZoom - worldPosition.worldY,
        };
        this.zoom = safeNewZoom;
    }

    /**
     * Gets the current zoom level.
     */
    public getZoom = () => {
        return this.zoom;
    }

    /**
     * Gets the view size.
     */
    public getViewSize = (): ViewSize => {
        return {...this.size};
    }

    /**
     * Gets the view position of the world coordinates, taking into account
     * the view offset and the current zoom. If the coordinates are negative or very large,
     * the view position might be out-of-view.
     * @param param0 
     */
    public getViewPosition = ({worldX, worldY}: WorldXY): ViewXY => {
        const {
            offsetX,
            offsetY
        } = this.offset;

        return {
            viewX: (worldX + offsetX) * this.zoom,
            viewY: (worldY + offsetY) * this.zoom,
        }
    }

    /**
     * Get the world position of the view coordinates. You can supply a view position that
     * is technically out-of-view.
     */
    public getWorldPosition = ({viewX, viewY}: ViewXY): WorldXY => {
        const {
            offsetX,
            offsetY
        } = this.offset;

        return {
            worldX: (viewX / this.zoom) - offsetX,
            worldY: (viewY / this.zoom) - offsetY
        };
    }

    /**
     * Get the top left of the view in world coordinates.
     * Equivalent to this.getWorldPosition(0, 0)
     */
    public getWorldTopLeft = () => {
        return this.getWorldPosition({viewX: 0, viewY: 0});
    }

    /**
     * Get the bottom right of the view in world coordinates.
     * Equivalent to this.getWorldPosition(columns, rows)
     */
    public getWorldBottomRight = () => {
        return this.getWorldPosition({
            viewX: this.size.viewWidth,
            viewY: this.size.viewHeight,
        });
    }

    /**
     * Get the center of the view in world coordinates.
     * Equivalent to this.getWorldPosition(columns / 2, rows / 2)
     */
    public getWorldCenter = () => {
        return this.getWorldPosition({
            viewX: this.size.viewWidth / 2,
            viewY: this.size.viewHeight / 2,
        });
    }
}