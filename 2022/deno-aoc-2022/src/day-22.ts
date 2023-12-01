const Tile = {
  Void: " ",
  Empty: ".",
  Wall: "#",
} as const;

type Tile = typeof Tile[keyof typeof Tile];

const Direction = {
  Right: 0,
  Down: 1,
  Left: 2,
  Up: 3,
} as const;

type Direction = typeof Direction[keyof typeof Direction];

type Instruction = number | "L" | "R";

function parseInput(input: string): {
  map: Tile[][];
  width: number;
  height: number;
  path: Instruction[];
} {
  const map: Tile[][] = [];
  let width = 0;
  let height = 0;

  const lines = input.split("\n");
  for (const line of lines) {
    if (line === "") {
      break;
    }

    width = Math.max(width, line.length);
  }

  height = lines.findIndex((l) => l === "");

  for (const line of lines) {
    if (line === "") {
      break;
    }

    map.push([]);

    for (const c of line) {
      map[map.length - 1].push(c as Tile);
    }
    const offset = width - map[map.length - 1].length;
    for (let i = 0; i < offset; i++) {
      map[map.length - 1].push(Tile.Void);
    }
  }

  const path: Instruction[] = [];
  let temp = 0;
  let pushNumber = false;
  for (const c of lines[lines.length - 1]) {
    if (c === "R" || c === "L") {
      if (pushNumber) {
        path.push(temp);
        temp = 0;
        pushNumber = false;
      }
      path.push(c as Instruction);
    } else {
      temp *= 10;
      temp += Number(c);
      pushNumber = true;
    }
  }
  if (pushNumber) {
    path.push(temp);
  }

  return {
    map,
    width,
    height,
    path,
  };
}

const day22a = async () => {
  const input = await Deno.readTextFile("input/day-22.txt");
  const data = parseInput(input);

  const rowEnds: { start: number; end: number }[] = [];
  const columnEnds: { start: number; end: number }[] = [];

  for (let y = 0; y < data.map.length; y++) {
    const start = data.map[y].findIndex((x) => x != " ");
    const end = data.map[y].findLastIndex((x) => x != " ");

    rowEnds.push({ start, end });
  }

  for (let x = 0; x < data.map[0].length; x++) {
    let start = 0;
    let end = 0;
    for (let y = 0; y < data.map.length; y++) {
      if (data.map[y][x] != " ") {
        start = y;
        break;
      }
    }
    for (let y = data.map.length - 1; y >= 0; y--) {
      if (data.map[y][x] != " ") {
        end = y;
        break;
      }
    }

    columnEnds.push({ start, end });
  }

  const position = { x: rowEnds[0].start, y: 0 };
  let facing: number = Direction.Right;

  for (const instruction of data.path) {
    if (instruction == "R") {
      facing = (facing + 1) % 4;
    } else if (instruction == "L") {
      facing = (facing + 3) % 4;
    } else {
      for (let n = 0; n < instruction; n++) {
        const nextPosition = { x: position.x, y: position.y };
        if (facing === Direction.Right) {
          if (
            data.map[position.y][(position.x + 1) % data.width] === Tile.Void
          ) {
            nextPosition.x = rowEnds[position.y].start;
          } else {
            nextPosition.x = (position.x + 1) % data.width;
          }
        } else if (facing === Direction.Down) {
          if (
            data.map[(position.y + 1) % data.height][position.x] === Tile.Void
          ) {
            nextPosition.y = columnEnds[position.x].start;
          } else {
            nextPosition.y = (position.y + 1) % data.height;
          }
        } else if (facing === Direction.Left) {
          if (
            data.map[position.y][
              (position.x + (data.width - 1)) % data.width
            ] === Tile.Void
          ) {
            nextPosition.x = rowEnds[position.y].end;
          } else {
            nextPosition.x = (position.x + (data.width - 1)) % data.width;
          }
        } else if (facing === Direction.Up) {
          if (
            data.map[(position.y + (data.height - 1)) % data.height][
              position.x
            ] === Tile.Void
          ) {
            nextPosition.y = columnEnds[position.x].end;
          } else {
            nextPosition.y = (position.y + (data.height - 1)) % data.height;
          }
        }

        if (data.map[nextPosition.y][nextPosition.x] === Tile.Empty) {
          position.x = nextPosition.x;
          position.y = nextPosition.y;
        } else {
          break;
        }
      }
    }
  }

  const result = (position.y + 1) * 1000 + (position.x + 1) * 4 + facing;

  console.log(`Day 22a ${result}`);
};

if (import.meta.main) {
  await day22a();
  // await day22b();
}
