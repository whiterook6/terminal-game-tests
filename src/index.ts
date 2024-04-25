import { Terrain } from "./terrain/Terrain";
import { Direction, Tunneler } from "./terrain/Tunneler";

const run = () =>{
  const terrain = new Terrain(50, 20, "█");
  const tunneler = new Tunneler(terrain, 2, 100, 0, 10, Direction.EAST);
  while (!tunneler.isDead()) {
    console.log("Digging...");
    tunneler.dig();
  }
  console.log(terrain.getMap().join("\n"));
}

run();