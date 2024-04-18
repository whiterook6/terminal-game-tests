import ansi from "ansi";
import { Screen } from "./Screen";

const run = () =>{
  const stdin = process.stdin;
  stdin.setRawMode( true );
  stdin.resume();
  stdin.setEncoding('utf8');

  const cursor = ansi(process.stdout);
  const clearScreen = () => {
    for (let i = 0; i < process.stdout.rows; i++) {
      cursor.goto(0, i).eraseLine();
    }
  }

  const screen = new Screen();
  const playerPositions: {x: number, y: number}[] = [
    screen.getWorldPosition(0, 0)
  ];

  process.stdout.write('\x1B[?1006h'); // Enable SGR mouse mode
  process.stdout.write('\x1B[?1003h'); // Enable any event mouse mode 

  process.on('exit', () => {
    process.stdout.write('\x1B[?1006l');
    process.stdout.write('\x1B[?1003l');
  });

  cursor.hide();
  
  // on any data into stdin
  stdin.on('data', function (buffer: Buffer) {
    const seq = buffer.toString('utf8');
    if (seq === '\u0003') {
      clearScreen();
      cursor.show().reset().bg.reset().goto(0, 0).write('\n');
      stdin.destroy();
      screen.destroy();
      return;
    }

    if (seq.startsWith('\x1B[<')){
      const [btn, x, y] = seq.slice(3, -1).split(';').map(Number);
      const event = {} as any;
      event.button = btn & 0b11000011;
      event.state = seq.at(-1) === 'M' ? 'pressed' : 'released';
      event.x = x;
      event.y = y;
      event.motion = !!(btn & 0b00100000);
      event.shift = !!(btn & 0b00000100);
      event.meta = !!(btn & 0b00001000);
      event.ctrl = !!(btn & 0b00010000);
      return;
    }

    switch(seq){
      case '\u001B[A': // Up
      case "w":
        playerPositions.push({x: playerPositions[playerPositions.length - 1].x, y: playerPositions[playerPositions.length - 1].y - 1});
        break;
      case '\u001B[B': // Down
      case "s":
        playerPositions.push({x: playerPositions[playerPositions.length - 1].x, y: playerPositions[playerPositions.length - 1].y + 1});
        break;
      case '\u001B[C': // Right
      case "d":
        playerPositions.push({x: playerPositions[playerPositions.length - 1].x + 1, y: playerPositions[playerPositions.length - 1].y});
        break;
      case '\u001B[D': // Left
      case "a":
        playerPositions.push({x: playerPositions[playerPositions.length - 1].x - 1, y: playerPositions[playerPositions.length - 1].y});
        break;
    }

    clearScreen();
    for (let i = 0; i < 10 && i < playerPositions.length; i++) {
      const {x, y} = playerPositions[playerPositions.length - i - 1];
      const {x: screenX, y: screenY} = screen.getScreenPosition(x, y);
      cursor.goto(screenX, screenY).rgb(255 * (i / 10), 255 * (1 - i / 10), 0).write('X').reset();
    }
  });
}

run();