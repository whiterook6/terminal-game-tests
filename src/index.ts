import ansi from "ansi";

const run = () =>{
  const stdin = process.stdin;
  stdin.setRawMode( true );
  stdin.resume();
  stdin.setEncoding('utf8');

  const cursor = ansi(process.stdout);

  process.stdout.write('\x1B[?1006h'); // Enable SGR mouse mode
  process.stdout.write('\x1B[?1003h'); // Enable any event mouse mode 

  process.on('exit', () => {
    process.stdout.write('\x1B[?1006l');
    process.stdout.write('\x1B[?1003l');
  });

  let column = 10;
  let row = 10;

  cursor.red().bg.grey().goto(10, 10).write("X").hide();
  
  // on any data into stdin
  stdin.on('data', function (buffer: Buffer) {
    const seq = buffer.toString('utf8');
    if (seq === '\u0003') {
      cursor.show().reset().bg.reset().write('\n');
      stdin.destroy();
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
      
      cursor.goto(event.x, event.y).write("X");
    }
  });
}

run();