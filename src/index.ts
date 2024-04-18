import ansi from "ansi";
import { Box } from "./Box";
import { GameLoop } from "./GameLoop";

const run = () =>{
  const cursor = ansi(process.stdout);

  process.on('SIGINT', function() {
    cursor.show().reset().bg.reset().goto(1, 1).write('\n');
    process.exit();
  });

  cursor.hide();

  let stringWindowLength = 0;
  let delayTimer = 0;
  const string = "Pack my box with five dozen liquor jugs.";
  cursor.goto(1, 1).eraseLine();
  const update = () => {
    if (stringWindowLength < string.length) {
      stringWindowLength += 0.5;
      cursor.goto(1, 1).write(string.slice(0, stringWindowLength));
      return;
    } else if (delayTimer < 60){
      delayTimer++;
      return;
    } else {
      delayTimer = 0;
      stringWindowLength = 0;
      cursor.goto(1, 1).eraseLine();
    }
  }

  setInterval(update, 1000 / 60);
}

run();