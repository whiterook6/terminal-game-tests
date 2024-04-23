import ansi from "ansi";
import { RadioList } from "./RadioList";

const items = [
  { label: "Annual Review (10)"},
  { label: "Art (12)"},
  { label: "Cogmind Beta Overhaul (6)"},
  { label: "Design (71)"},
  { label: "Dev Series: 7DRL Postmortem (4)"},
  { label: "Dev Series: Fonts (4)"},
  { label: "Dev Series: Full UI Upscaling (5)"},
  { label: "Dev Series: Map Zooming (5)"},
  { label: "Dev Series: Procedural Maps (7)"},
  { label: "Dev Series: Sound Effects (6)"},
  { label: "Dev Series: Story in Roguelikes (3)"},
  { label: "Dev Series: Ultimate Morgue File (4)"},
  { label: "Game Overview (3)"},
  { label: "Gamedev (14)"},
  { label: "GUI (24)"},
  { label: "Internal (6)"},
  { label: "Marketing (5)"},
  { label: "Mechanics (31)"},
  { label: "Meta (7)"},
  { label: "Post-Mortem (5)"},
  { label: "Release (4)"},
  { label: "Uncategorized (8)"},
];

const run = () =>{
  const cursor = ansi(process.stdout);
  
  const radioList = new RadioList(20);
  let selectedIndex = 0;
  const draw = () => {
    const rendered = radioList.render(items, items[selectedIndex]);
    const lines = rendered.split("\n");
    for (let i = 0; i < lines.length; i++){
      cursor.goto(1, i + 1).write(lines[i]).eraseLine();
    }
  }

  draw();

  process.on('SIGINT', function() {
    cursor.goto(0, 0).show().reset().bg.reset().eraseLine();
    process.exit();
  });

  cursor.hide();

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
        selectedIndex = selectedIndex - 1;
        if (selectedIndex < 0){
          selectedIndex = items.length - 1;
        }
        draw();
        break;
      case "s":
        selectedIndex = (selectedIndex + 1) % items.length;
        draw();
        break;
    }
  });
}

run();