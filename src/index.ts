import ansi from "ansi";
import { Window, TitlePosition } from "./Window";
import { GameLoop } from "./GameLoop";
import { Screen, ScreenSize } from "./Screen";

const run = () =>{
  const cursor = ansi(process.stdout);

  process.on('SIGINT', function() {
    cursor.goto(0, 0).show().reset().bg.reset().eraseLine();
    process.exit();
  });
  cursor.hide().brightWhite();

  const drawWindows = (screenSize: ScreenSize) => {
    const { screenWidth, screenHeight } = screenSize;
    const LogWindow = Window({
      width: screenWidth / 2,
      height: 7,
      title: "Log",
      titlePosition: TitlePosition.BOTTOM_RIGHT
    });
    const PlayerWindow = Window({
      width: screenWidth / 2,
      height: 7,
      title: "Player",
      titlePosition: TitlePosition.BOTTOM_LEFT
    });
    const MapWindow = Window({
      width: screenWidth - 50,
      height: screenHeight - PlayerWindow.length + 1,
      title: "Map",
      titlePosition: TitlePosition.TOP
    });
    const InventoryWindow = Window({
      width: 50,
      height: screenHeight - PlayerWindow.length + 1,
      title: "Inventory",
      titlePosition: TitlePosition.TOP_LEFT
    });

    for (let i = 0; i < LogWindow.length; i++) {
      cursor.goto(1, i+1).write(LogWindow[i]).write(PlayerWindow[i]);
    }
    for (let i = 0; i < MapWindow.length; i++) {
      cursor.goto(1, i+1+LogWindow.length).write(MapWindow[i]).write(InventoryWindow[i]);
    }
    cursor.nextLine();
  }

  const screen = new Screen();
  screen.addListener(drawWindows);
  drawWindows(screen.getScreenSize());
  setInterval(() => {
    ;
  }, 1000);
}

run();