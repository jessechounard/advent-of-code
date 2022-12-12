type Cell = {
  height: number;
  distance: number;
  start: boolean;
  end: boolean;
};

function recursiveDistance(
  x: number,
  y: number,
  height: number,
  distance: number,
  cells: Cell[][]
) {
  if (x < 0 || x >= cells[0].length || y < 0 || y >= cells.length) {
    return;
  }
  if (cells[y][x].height > height + 1) {
    return;
  }
  if (cells[y][x].distance !== -1 && cells[y][x].distance <= distance + 1) {
    return;
  }

  cells[y][x].distance = distance + 1;
  recursiveDistance(x - 1, y, cells[y][x].height, cells[y][x].distance, cells);
  recursiveDistance(x + 1, y, cells[y][x].height, cells[y][x].distance, cells);
  recursiveDistance(x, y - 1, cells[y][x].height, cells[y][x].distance, cells);
  recursiveDistance(x, y + 1, cells[y][x].height, cells[y][x].distance, cells);
}

function parseCells(inputFile: string): Cell[][] {
  const lines = inputFile.split("\n", -1);
  const cells: Cell[][] = [];

  for (const line of lines) {
    const characters = line.split("");
    const cellRow = characters.map((x) => {
      let start = false;
      let end = false;
      if (x === "S") {
        start = true;
        x = "a";
      } else if (x === "E") {
        end = true;
        x = "z";
      }
      return {
        height: x.charCodeAt(0) - "a".charCodeAt(0),
        distance: -1,
        start,
        end,
      };
    });

    cells.push(cellRow);
  }

  return cells;
}

const day12a = async () => {
  const inputFile = await Deno.readTextFile("input/day-12.txt");
  const cells = parseCells(inputFile);

  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  for (let y = 0; y < cells.length; y++) {
    for (let x = 0; x < cells[0].length; x++) {
      if (cells[y][x].start) {
        startX = x;
        startY = y;
      } else if (cells[y][x].end) {
        endX = x;
        endY = y;
      }
    }
  }

  for (let y = 0; y < cells.length; y++) {
    for (let x = 0; x < cells[0].length; x++) {
      if (cells[y][x].start) {
        startX = x;
        startY = y;
      } else if (cells[y][x].end) {
        endX = x;
        endY = y;
      }
    }
  }

  recursiveDistance(startX, startY, 0, -1, cells);

  console.log(`Day 12a: ${cells[endY][endX].distance}`);
};

const day12b = async () => {
  const inputFile = await Deno.readTextFile("input/day-12.txt");
  const cells = parseCells(inputFile);

  let endX = 0;
  let endY = 0;

  for (let y = 0; y < cells.length; y++) {
    for (let x = 0; x < cells[0].length; x++) {
      if (cells[y][x].end) {
        endX = x;
        endY = y;
      }
    }
  }

  for (let y = 0; y < cells.length; y++) {
    for (let x = 0; x < cells[0].length; x++) {
      if (cells[y][x].height == 0) {
        recursiveDistance(x, y, 0, -1, cells);
      }
    }
  }

  console.log(`Day 12b: ${cells[endY][endX].distance}`);
};

if (import.meta.main) {
  await day12a();
  await day12b();
}
