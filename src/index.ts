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
  let speedX = 50 / 60;
  let speedY = 15 / 60;
  const update = () => {
    buffer.clear();
    textPosition.viewX += speedX;
    textPosition.viewY += speedY;
    if (textPosition.viewX >= buffer.width()){
      speedX = -50 / 60;
    } else if (textPosition.viewX < 0) {
      speedX = 50 / 60;
    }
    if (textPosition.viewY >= buffer.height()){
      speedY = -15 / 60;
    } else if (textPosition.viewY < 0) {
      speedY = 15 / 60;
    }
    
    buffer.write(textPosition, ["[", [255, 255, 255], [0, 0, 0]]);
    const xString = textPosition.viewX.toFixed(2);
    buffer.write({
      viewX: textPosition.viewX + 1,
      viewY: textPosition.viewY
    }, [xString, [255, 0, 0], [0, 0, 0]]);
    buffer.write({
      viewX: textPosition.viewX + 1 + xString.length,
      viewY: textPosition.viewY
    }, [",", [0,0,0], [255, 255, 255]]);
    const yString = textPosition.viewY.toFixed(2);
    buffer.write({
      viewX: textPosition.viewX + 2 + xString.length,
      viewY: textPosition.viewY
    }, [yString, [0, 0, 255], [0, 0, 0]]);
    buffer.write({
      viewX: textPosition.viewX + 2 + xString.length + yString.length,
      viewY: textPosition.viewY
    }, ["]", [0,0,0], [255, 255, 255]]);

    
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