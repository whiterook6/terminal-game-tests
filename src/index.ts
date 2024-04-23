import { Cell, Path, Pathfinder } from "./Pathfinder";

type OurMap = string[];

const map: OurMap = [ // [y, x], zero-indexes
`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa   a`,
`8   8               8               8           8                   8   8`,
`8   8   aaaaaaaaa   8   aaaaa   aaaa8aaaa   aaaa8   aaaaa   aaaaa   8   8`,
`8               8       8   8           8           8   8   8       8   8`,
`8aaaaaaaa   a   8aaaaaaa8   8aaaaaaaa   8aaaa   a   8   8   8aaaaaaa8   8`,
`8       8   8               8           8   8   8   8   8           8   8`,
`8   a   8aaa8aaaaaaaa   a   8   aaaaaaaa8   8aaa8   8   8aaaaaaaa   8   8`,
`8   8               8   8   8       8           8           8       8   8`,
`8   8aaaaaaaaaaaa   8aaa8   8aaaa   8   aaaaa   8aaaaaaaa   8   aaaa8   8`,
`8           8       8   8       8   8       8           8   8           8`,
`8   aaaaa   8aaaa   8   8aaaa   8   8aaaaaaa8   a   a   8   8aaaaaaaaaaa8`,
`8       8       8   8   8       8       8       8   8   8       8       8`,
`8aaaaaaa8aaaa   8   8   8   aaaa8aaaa   8   aaaa8   8   8aaaa   8aaaa   8`,
`8           8   8           8       8   8       8   8       8           8`,
`8   aaaaa   8   8aaaaaaaa   8aaaa   8   8aaaa   8aaa8   aaaa8aaaaaaaa   8`,
`8   8       8           8           8       8   8   8               8   8`,
`8   8   aaaa8aaaa   a   8aaaa   aaaa8aaaa   8   8   8aaaaaaaaaaaa   8   8`,
`8   8           8   8   8   8   8           8               8   8       8`,
`8   8aaaaaaaa   8   8   8   8aaa8   8aaaaaaa8   aaaaaaaaa   8   8aaaaaaa8`,
`8   8       8   8   8           8           8   8       8               8`,
`8   8   aaaa8   8aaa8   aaaaa   8aaaaaaaa   8aaa8   a   8aaaaaaaa   a   8`,
`8   8                   8           8               8               8   8`,
`8   8aaaaaaaaaaaaaaaaaaa8aaaaaaaaaaa8aaaaaaaaaaaaaaa8aaaaaaaaaaaaaaa8aaa8`,
];
const start: Cell = [70, 0];
const goal: Cell = [2, 22];

const canWalk = (from: Cell, to: Cell) => {
  const [x, y] = to;
  if (y < 0 || y >= map.length || x < 0 || x >= map[0].length){
    return false;
  }
  return map[y][x] === ' ';
};

const pathfinder = new Pathfinder();
console.profile();
for (let i = 0; i < 1000; i++){
  pathfinder.findPath(start, goal, canWalk);
}
console.profileEnd();