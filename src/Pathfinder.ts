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
    const frontier: FrontierNode[] = [this.makeNode(start, start, 0, this.getCost(start, goal))];
    const visited: FrontierNode[] = [];

    const iterationLimit = 10_000;
    let iterations = 0;
    while (frontier.length > 0 && iterations < iterationLimit){
      iterations++;
      let current: FrontierNode | undefined = undefined;

      if (frontier.length === 1){
        current = frontier.pop();
      } else {
        const lowestCostIndex = this.getLowestCostFrontierNode(frontier);      
        if (lowestCostIndex === -1){
          break;
        }
  
        current = frontier[lowestCostIndex];
        frontier.splice(lowestCostIndex, 1);
      }

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
        if (visited.some((v) => v[0] === neighbor[0] && v[1] === neighbor[1])){
          continue;
        } else if (frontier.some((f) => f[0] === neighbor[0] && f[1] === neighbor[1] && f[4] + f[5] < costFromStart + costToGoal)){
          continue;
        }

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
    const [x, y] = node;

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
      return isWalkable([x, y], to);
    }) as Cell[];
  }

  private getLowestCostFrontierNode = (frontier: FrontierNode[]): number => {
    if (frontier.length === 0){
      return -1;
    }

    let lowestCost = Number.POSITIVE_INFINITY;
    let lowestCostIndex = -1;
    for (let i = 0; i < frontier.length; i++){
      const node = frontier[i];
      const cost = node[4] + node[5];
      if (cost < lowestCost){
        lowestCost = cost;
        lowestCostIndex = i;
      }
    }
    
    return lowestCostIndex;
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

  private getCost = (a: Cell, b: Cell): number => { // eg 10 or 14
    const hSquared = (a[0] - b[0]) * (a[0] - b[0]);
    const vSquared = (a[1] - b[1]) * (a[1] - b[1]);
    return Math.floor(Math.sqrt(hSquared + vSquared) * 10);
  }
}