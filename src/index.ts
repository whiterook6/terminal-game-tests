import ansi from "ansi";
import { Window, TitlePosition } from "./Window";
import { ProgressBar, ProgressBarLabel } from "./ProgressBar";
import { Map } from "./Map";

const run = () =>{
  const text = [
    "This is a regular paragraph block. Professionally productize",
    "highly efficient results with world-class core competencies.",
    "Objectively matrix leveraged architectures vis-a-vis error-f",
    "ree applications. Completely maximize customized portals via",
    "fully researched metrics. Enthusiastically generate premier ",
    "action items through web-enabled e-markets. Efficiently para",
    "llel task holistic intellectual capital and client-centric m",
  ]; // 60 * 7

  const map = Map(text, { offsetX: 5, offsetY: -3 }, { viewWidth: 40, viewHeight: 9 });
  console.log(map.join("\n"));
}

run();