import ansi from "ansi";
import { Window, TitlePosition } from "./Window";
import { ProgressBar, ProgressBarLabel } from "./ProgressBar";

const run = () =>{
  const cursor = ansi(process.stdout);
  process.stdin.resume();
  let interval;

  process.on('SIGINT', function() {
    if (interval) {
      clearInterval(interval);
    }
    cursor.goto(0, 0).show().reset().bg.reset().eraseLine();
    process.exit();
  });
  cursor.hide().brightWhite();

  let value = 0;
  const maxValue = 69;
  const width = 20;
  let delay = 0;
  const update = () => {
    if (value >= maxValue && delay > 30){
      value = 0;
      delay = 0;
    } else if (value >= maxValue) {
      value = maxValue;
      delay++;
    } else {
      value += Math.random();
    }

    cursor.brightGreen().goto(5, 5).write(ProgressBar({
      value,
      maxValue,
      minValue: 0,
      width
    })).reset();

    cursor.brightYellow().goto(5, 6).write(ProgressBar({
      value,
      maxValue,
      minValue: 0,
      width,
      label: ProgressBarLabel.division,
    })).reset();

    cursor.brightRed().goto(5, 7).write(ProgressBar({
      value,
      maxValue,
      minValue: 0,
      width,
      label: ProgressBarLabel.percentage,
    })).reset();

    cursor.brightMagenta().goto(5, 8).write(ProgressBar({
      value,
      maxValue,
      minValue: 0,
      width
    })).reset();
  }

  interval = setInterval(update, 1000 / 60);
}

run();