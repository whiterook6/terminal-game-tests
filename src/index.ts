import ansi from "ansi";
import { View } from "./View";

const run = () =>{
  const cursor = ansi(process.stdout);

  process.on('SIGINT', function() {
    cursor.goto(0, 0).show().reset().bg.reset().eraseLine();
    process.exit();
  });

  cursor.hide();

  let columns = process.stdout.columns;
  let rows = process.stdout.rows;

  process.stdout.addListener("resize", () => {
    columns = process.stdout.columns;
    rows = process.stdout.rows;
  });

  const view = new View({offsetX: 5, offsetY: 5}, {viewWidth: columns, viewHeight: rows});

  const stdin  = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf-8");
  stdin.on("data", (key: string) => {
    // ctrl-c ( end of text )
    if ( key === "\u0003" ) {
      cursor.goto(0, 0).show().reset().bg.reset().eraseLine();
      process.exit();
    }

    switch (key){
      case "w":
        view.panView({offsetX: 0, offsetY: -1});
        break;
      case "s":
        view.panView({offsetX: 0, offsetY: 1});
        break;
      case "a":
        view.panView({offsetX: -1, offsetY: 0});
        break;
      case "d":
        view.panView({offsetX: 1, offsetY: 0});
        break;
      case "q": // zoom in
        view.zoomView({viewX: columns / 2, viewY: rows / 2}, view.getZoom() * 1.5);
        break;
      case "e": // zoom out
        view.zoomView({viewX: columns / 2, viewY: rows / 2}, view.getZoom() / 1.5);
        break;
    }
  });
  
  const draw = () => {
    const zoom = view.getZoom();
    cursor.goto(1, 1).eraseLine().write(`Zoom: ${zoom}`);

    const worldCoordinates = view.getWorldPosition({viewX: 10, viewY: 10});
    cursor.goto(10, 10).eraseLine().write(`[${worldCoordinates.worldX}, ${worldCoordinates.worldY}]`);
    
    const viewCoordinates = view.getViewPosition({worldX: 10, worldY: 10});
    if (viewCoordinates.viewX < 0 || viewCoordinates.viewY < 0 || viewCoordinates.viewX >= columns || viewCoordinates.viewY >= rows) {
      return;
    }

    cursor.goto(viewCoordinates.viewX, viewCoordinates.viewY).eraseLine().write(`[10, 10]`);
  }

  setInterval(() => {
    draw();
  }, 1000/60);
}

run();