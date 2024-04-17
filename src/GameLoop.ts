export type CallbackFN = (deltaTimeMS: number) => void;

export class GameLoop {
    private update: CallbackFN;
    private paused: boolean = false;
    private static tickLengthMs: number = 1000 / 60;
    private intervalID?: NodeJS.Timeout;


    constructor(callback: CallbackFN){
        this.update = callback;
    }

    public togglePause = (): void => {
        if (this.isPaused){
            this.paused = false;
            this.intervalID = setInterval(this.gameLoop, GameLoop.tickLengthMs);
        } else {
            this.paused = true;
            if (this.intervalID){
                clearInterval(this.intervalID);
                this.intervalID = undefined;
            }
        }
    }

    public isPaused = (): boolean => {
        return this.paused;
    }

    public gameLoop = (): void => {
        if (this.isPaused){
            return;
        }

        this.update(GameLoop.tickLengthMs);
    }
}
