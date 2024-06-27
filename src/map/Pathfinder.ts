import Heap from 'heap';

/**
 * A cell in the grid. [X, Y], zero-indexed
 */
export type Cell = [number, number];

/**
 * Includes start and end cell. For a loop, the last cell should be the same as the first cell.
 */
export type Path = Cell[];

/**
 * A function to check whether a given cell is walkable or not.
 */
export type IsWalkable = (from: Cell, to: Cell) => boolean;

type FrontierNode = [
  number, // x
  number, // y
  number, // x of previous node
  number, // y of previous node
  number, // cost from start
  number, // cost to goal
];

export class Pathfinder {
  public findPath = (start: Cell, goal: Cell, isWalkable: IsWalkable): Path => {
    const frontier = new Heap<FrontierNode>((a, b) => a[4] + a[5] - b[4] - b[5]);
    frontier.push(this.makeNode(start, start, 0, this.getCost(start, goal)));
    const visited: FrontierNode[] = [];

    const iterationLimit = 10_000;
    let iterations = 0;
    while (!frontier.empty() && iterations < iterationLimit){
      iterations++;
      const current = frontier.pop();
      if (!current){
        break;
      }
      
      const alreadyVisited = visited.find((v) => v[0] === current[0] && v[1] === current[1]);
      if (alreadyVisited){
        continue;
      } else {
        visited.push(current);
      }

      if (current[0] === goal[0] && current[1] === goal[1]){
        break;
      }

      const neighbors = this.getNeighbors(current, isWalkable);
      for (const neighbor of neighbors){
        const costFromStart = current[4] + this.getCost([current[0], current[1]], neighbor);
        const costToGoal = this.getCost(neighbor, goal);
        frontier.push(this.makeNode(neighbor, [current[0], current[1]], costFromStart, costToGoal));
      }
    }

    const path: Path = [];
    let current = visited.pop();
    while (current){
      path.unshift([current[0], current[1]]);
      if (current[0] === start[0] && current[1] === start[1]){
        break;
      } else if (current[0] === current[2] && current[1] === current[3]){
        break;
      }
      
      current = visited.find((v) => v[0] === current[2] && v[1] === current[3]);
    }

    return path;
  }

  private getNeighbors = (node: FrontierNode, isWalkable: IsWalkable): Cell[] => {
    const [x, y, previousX, previousY] = node;

    return [
      [x - 1, y - 1],
      [x, y - 1],
      [x + 1, y - 1],
      [x - 1, y],
      [x + 1, y],
      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1]
    ].filter((to: Cell) => {
      return isWalkable([x, y], to) && (to[0] !== previousX || to[1] !== previousY);
    }) as Cell[];
  }

  private makeNode = (cell: Cell, previous: Cell, costFromStart: number, costToGoal: number): FrontierNode => {
    return [
      cell[0],
      cell[1],
      previous[0],
      previous[1],
      costFromStart,
      costToGoal
    ];
  }

  private getCost = (a: Cell, b: Cell): number => { 
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }
}