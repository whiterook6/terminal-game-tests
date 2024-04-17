export class Screen {
    private columns: number;
    private rows: number;

    constructor(){
        this.columns = process.stdout.columns;
        this.rows = process.stdout.rows;
        process.stdout.addListener("resize", this.onResize);
    }

    public destroy = () => {
        process.stdout.removeListener("resize", this.onResize);
    }

    private onResize = () => {
        this.columns = process.stdout.columns;
        this.rows = process.stdout.rows;
        console.log(`columns: ${this.columns}, rows: ${this.rows}`);
    }
}