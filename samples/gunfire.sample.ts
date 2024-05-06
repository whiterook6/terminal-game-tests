import ansi from "ansi";
import { WorldXY } from "./types";

const run = () =>{
  const cursor = ansi(process.stdout);

  process.on('SIGINT', function() {
    cursor.goto(0, 0).show().reset().bg.reset().eraseLine();
    process.exit();
  });

  const screenWidth = process.stdout.columns;
  const screenHeight = process.stdout.rows;

  cursor.hide();

  const playerPosition: WorldXY = {
    worldX: 2,
    worldY: Math.floor(screenHeight / 2),
  };
  const targetPosition: WorldXY = {
    worldX: screenWidth - 2,
    worldY: Math.floor(screenHeight / 2),
  };
  const bullets: WorldXY[] = [];
  const bulletsSpeed: WorldXY[] = [];

  const stdin  = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf-8");

  const update = () => {
    cursor.goto(playerPosition.worldX, playerPosition.worldY)
    .eraseLine()
    .write("P");

    bullets.forEach((bullet, index) => {
      const previousX = bullet.worldX;
      bullet.worldX += bulletsSpeed[index].worldX;
      bullet.worldY += bulletsSpeed[index].worldY;

      bulletsSpeed[index].worldX += Math.random() * 0.2 + 0.1;

      if (bullet.worldX >= targetPosition.worldX){
        bullets.splice(index, 1);
        bulletsSpeed.splice(index, 1);
      }

      const bulletText = "=".repeat(Math.ceil(bullet.worldX - previousX));
      cursor.goto(previousX, bullet.worldY).write(bulletText);
    });

    cursor.goto(Math.floor(targetPosition.worldX), targetPosition.worldY)
      .write("T").eraseLine();
  };
  const interval = setInterval(update, 1000/60);

  stdin.on("data", (key: string) => {
    // ctrl-c ( end of text )
    if ( key === "\u0003" ) {
      cursor.goto(0, 0).show().reset().bg.reset().eraseLine();
      clearInterval(interval);
      process.exit();
    }

    switch (key){
      case " ":
        bullets.push({
          worldX: playerPosition.worldX + 1,
          worldY: playerPosition.worldY
        });
        bulletsSpeed.push({
          worldX: 1,
          worldY: 0
        });
        break;
    }
  });
}

run();