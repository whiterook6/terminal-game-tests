import ansi from "ansi";
import { Framebuffer } from "./framebuffer/Framebuffer";
import { ParticleSystem } from "./particles/ParticleSystem";
import { randomAngle, randomColor, randomElement, randomFloat, randomInt } from "./Random";
import {buildLogger, clearLogs} from "./logging/Logging";

const run = () =>{
  clearLogs();
  const logger = buildLogger();

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
  cursor.hide();

  // get the size of the terminal
  const terminalWidth = process.stdout.columns;
  const terminalHeight = process.stdout.rows;
  const framebuffer = new Framebuffer({viewHeight: terminalHeight, viewWidth: terminalWidth});
  const particleSystem = new ParticleSystem(1000, terminalWidth, terminalHeight);
  logger.debug(`Terminal width: ${terminalWidth}, Terminal height: ${terminalHeight}`);

  const characters = "⋆˖⁺‧₊☽◯☾₊‧⁺˖⋆".split("");
  interval = setInterval(() => {
    particleSystem.update(60);
    particleSystem.spawn({
      worldX: terminalWidth / 2,
      worldY: terminalHeight / 2,
      worldDX: randomFloat(-10, -12),
      worldDY: randomFloat(-4, -5),
      millisecondsLeft: randomInt(10000, 20000),
      color: randomColor(),
      character: randomElement(characters),
    })
    framebuffer.clear();
    particleSystem.render(framebuffer);
    framebuffer.render(cursor);
  }, 1000 / 60);
};

run();