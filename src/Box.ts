export const Box = (lines: string[]): string[] => {
    const width = Math.max(...lines.map(line => line.length));
    const topAndBottomBars = '─'.repeat(width);
    return [
        `╭${topAndBottomBars}╮`,
        ...lines.map(line => `│${line}` + ' '.repeat(width - line.length) + '│'),
        `╰${topAndBottomBars}╯`,
    ];
}