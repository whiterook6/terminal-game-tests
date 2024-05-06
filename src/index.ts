import ansi from "ansi";
import {Framebuffer} from "./framebuffer/Framebuffer"
import { TitlePosition, Window } from "./ui/Window";

const run = () =>{
  const cursor = ansi(process.stdout);

  cursor.hide().brightWhite();

  const framebuffer = Framebuffer({
    viewHeight: process.stdout.rows,
    viewWidth: process.stdout.columns
  });

  let logWindow: string[];
  let playerWindow: string[];
  let mapWindow: string[];
  let inventoryWindow: string[];

  const buildWindows = () => {
    const screenWidth = process.stdout.columns;
    const screenHeight = process.stdout.rows;

    logWindow = Window({
      width: Math.floor(screenWidth / 2),
      height: 7,
      title: "Log",
      titlePosition: TitlePosition.BOTTOM_RIGHT
    });
    playerWindow = Window({
      width: Math.ceil(screenWidth / 2),
      height: 7,
      title: "Player",
      titlePosition: TitlePosition.BOTTOM_LEFT
    });
    mapWindow = Window({
      width: screenWidth - 25,
      height: screenHeight - playerWindow.length + 1,
      title: "Map",
      titlePosition: TitlePosition.TOP
    });
    inventoryWindow = Window({
      width: 25,
      height: screenHeight - playerWindow.length + 1,
      title: "Inventory",
      titlePosition: TitlePosition.TOP_LEFT
    });
  };

  buildWindows();
  process.stdout.addListener("resize", () => {
    framebuffer.resize({
      viewHeight: process.stdout.rows,
      viewWidth: process.stdout.columns
    });
    buildWindows();
  });

  const render = () => {
    framebuffer.clear();
    for (let y = 0; y < logWindow.length; y++) {
      framebuffer.write({
        viewX: 0,
        viewY: y,
      }, [[logWindow[y], [255, 255, 255], [0, 0, 0]]]);
    }
    for (let y = 0; y < playerWindow.length; y++) {
      framebuffer.write({
        viewX: logWindow[0].length,
        viewY: y,
      }, [[playerWindow[y], [255, 255, 255], [0, 0, 0]]]);
    }
    for (let y = 0; y < mapWindow.length; y++) {
      framebuffer.write({
        viewX: 0,
        viewY: y + logWindow.length,
      }, [[mapWindow[y], [255, 255, 255], [0, 0, 0]]]);
    }
    for (let y = 0; y < inventoryWindow.length; y++) {
      framebuffer.write({
        viewX: mapWindow[0].length,
        viewY: y + logWindow.length,
      }, [[inventoryWindow[y], [255, 255, 255], [0, 0, 0]]]);
    }

    framebuffer.render(cursor);
  }

  const interval = setInterval(() => {
    render();
  }, 1000 / 60);

  process.on('SIGINT', function() {
    cursor.goto(0, 0).show().reset().bg.reset().eraseLine();
    clearInterval(interval);
    process.exit();
  });
}

run();