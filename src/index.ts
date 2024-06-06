import ansi from "ansi";
import { randomColor, randomFloat } from "./Random";
import { Framebuffer } from "./framebuffer/Framebuffer";
import { RGB, WorldXY } from "./types";
import { randomInt } from "crypto";

const leftWall = 1;
const rightWall = 100;
const topWall = 1;
const bottomWall = 30;
const particleCount = 10;
const positions: WorldXY[] = Array.apply(null, { length: particleCount }).map((_, i) => ({
  worldX: randomInt(leftWall, rightWall),
  worldY: randomInt(topWall, bottomWall),
}));
const velocities: WorldXY[] = Array.apply(null, { length: particleCount }).map((_, i) => ({
  worldX: randomFloat(-4, 4),
  worldY: randomFloat(-2, 2),
}));
const colors: RGB[] = Array.apply(null, { length: particleCount }).map(() => randomColor());
const backgroundColor: RGB = [0, 0, 0];
const framebuffer = new Framebuffer({viewHeight: 30, viewWidth: 100});


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
  cursor.hide();

  const update = (deltaTMS) => {
    positions.forEach((position, i) => {
      position.worldX += velocities[i].worldX * deltaTMS / 1000;
      position.worldY += velocities[i].worldY * deltaTMS / 1000;

      velocities[i].worldY += deltaTMS / 1000;

      if (position.worldX < leftWall) {
        position.worldX = leftWall;
        velocities[i].worldX *= -1;
      } else if (position.worldX > rightWall) {
        position.worldX = rightWall;
        velocities[i].worldX *= -1;
      }

      if (position.worldY < topWall) {
        position.worldY = topWall;
        velocities[i].worldY *= -1;
      } else if (position.worldY > bottomWall) {
        position.worldY = bottomWall;
        velocities[i].worldY *= -1;
      }
    });
  }

  const render = () => {
    framebuffer.clear();
    for (let i = 0; i < particleCount; i++) {
      for (let j = 0; j < 10; j++) {
        const trailColor: RGB = colors[i].map(c => Math.floor(c * (1 - j / 10))) as RGB;
        framebuffer.write({
          viewX: Math.floor(positions[i].worldX - j * velocities[i].worldX),
          viewY: Math.floor(positions[i].worldY - j * velocities[i].worldY),
        }, [['.', trailColor, backgroundColor]]);
      }
    }
    for (let i = 0; i < particleCount; i++) {
      framebuffer.write({
        viewX: Math.floor(positions[i].worldX),
        viewY: Math.floor(positions[i].worldY),
      }, [['o', colors[i], backgroundColor]]);
    }
    framebuffer.render(cursor);
  };

  interval = setInterval(() => {
    update(60);
    render();
  }, 1000 / 60);
};

run();