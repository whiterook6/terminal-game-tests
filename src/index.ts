import { Screen } from "./Screen";

const run = () =>{
  const screen = new Screen();
  const stdin = process.stdin;
  stdin.setRawMode( true );
  stdin.resume();
  stdin.setEncoding('utf8');

  process.stdout.write('\x1B[?1006h'); // Enable SGR mouse mode
  process.stdout.write('\x1B[?1003h'); // Enable any event mouse mode  

  process.on('exit', () => {
    process.stdout.write('\x1B[?1006l');
    process.stdout.write('\x1B[?1003l');
  });

  // on any data into stdin
  stdin.on('data', function (buffer: Buffer) {
    const seq = buffer.toString('utf8');
    if (seq === '\u0003') {
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
      console.log(event.y);
    } else {
      console.log(JSON.stringify(seq));
    }
  });
}

run();