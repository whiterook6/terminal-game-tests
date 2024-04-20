import ansi from "ansi";
import { Window, TitlePosition } from "./Window";
import { ProgressBar, ProgressBarLabel } from "./ProgressBar";
import { Map } from "./Map";
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

  const text = [
    "This is a regular paragraph block. Professionally productize",
    "highly efficient results with world-class core competencies.",
    "Objectively matrix leveraged architectures vis-a-vis error-f",
    "ree applications. Completely maximize customized portals via",
    "fully researched metrics. Enthusiastically generate premier ",
    "action items through web-enabled e-markets. Efficiently para",
    "llel task holistic intellectual capital and client-centric m",
  ]; // 60 * 7
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
        view.panView({offsetX: 0, offsetY: 1});
        break;
      case "s":
        view.panView({offsetX: 0, offsetY: -1});
        break;
      case "a":
        view.panView({offsetX: 1, offsetY: 0});
        break;
      case "d":
        view.panView({offsetX: -1, offsetY: 0});
        break;
    }
  });

  const draw = () => {
    const map = Map(text, view.getOffset(), view.getSize());
    for (let i = 0; i < map.length; i++){
      cursor.goto(0, i).write(map[i]).eraseLine();
    }
  }

  setInterval(() => {
    draw();
  }, 1000/60);
}

run();