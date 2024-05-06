import ansi from "ansi";
import { Framebuffer } from "./framebuffer/Framebuffer";
import { ViewXY } from "./types";

const run = () => {
  const cursor = ansi(process.stdout).hide();
  const buffer = Framebuffer({
    viewWidth: process.stdout.columns,
    viewHeight: process.stdout.rows
  });

  process.stdout.addListener("resize", () => {
    buffer.resize({
      viewWidth: process.stdout.columns,
      viewHeight: process.stdout.rows
    });
  });

  const textPosition: ViewXY = {
    viewX: 0,
    viewY: 0
  };
  let speedX = 20 / 60; // 2 characters per second
  let speedY = 15 / 60; // 1 character per second
  const update = () => {
    buffer.clear();
    textPosition.viewX += speedX;
    textPosition.viewY += speedY;
    if (textPosition.viewX >= buffer.width()){
      speedX = -20 / 60;
    } else if (textPosition.viewX < 0) {
      speedX = 20 / 60;
    }
    if (textPosition.viewY >= buffer.height()){
      speedY = -15 / 60;
    } else if (textPosition.viewY < 0) {
      speedY = 15 / 60;
    }
    
    buffer.write(textPosition, "Hello, world!");
    buffer.render(cursor);
  };
  let interval = setInterval(update, 1000 / 60);

  process.on('SIGINT', function() {
    cursor.goto(0, 0).show().reset().bg.reset().eraseLine();
    clearInterval(interval);
    process.exit();
  });
}

run();