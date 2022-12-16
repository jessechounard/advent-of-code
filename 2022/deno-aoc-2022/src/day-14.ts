type Point = {
  x: number;
  y: number;
};

type Grid = {
  topLeft: Point;
  bottomRight: Point;
  cells: Set<string>;
  hasFloor: boolean;
};

function gridFilled(x: number, y: number, grid: Grid) {
  if (grid.hasFloor && y === grid.bottomRight.y + 2) {
    return true;
  }
  return grid.cells.has(`${x},${y}`);
}

function gridInsert(x: number, y: number, grid: Grid) {
  grid.cells.add(`${x},${y}`);
}

function dropSand(grid: Grid): boolean {
  let x = 500;
  let y = 0;

  if (gridFilled(x, y, grid)) {
    return false;
  }

  while (true) {
    if (y > grid.bottomRight.y + 3) {
      return false;
    }

    // attempt to fall down
    if (!gridFilled(x, y + 1, grid)) {
      y++;
      continue;
    }

    // attempt to fall down-left
    if (!gridFilled(x - 1, y + 1, grid)) {
      x--;
      y++;
      continue;
    }

    // attempt to fall down-right
    if (!gridFilled(x + 1, y + 1, grid)) {
      x++;
      y++;
      continue;
    }

    // if we got here, we couldn't fall, add location to grid
    gridInsert(x, y, grid);
    return true;
  }
}

const day14a = async () => {
  const inputFile = await Deno.readTextFile("input/day-14.txt");
  const lines = inputFile.split("\n");

  const cells = new Set<string>();
  const topLeft = {
    x: Number.MAX_SAFE_INTEGER,
    y: Number.MAX_SAFE_INTEGER,
  };
  const bottomRight = {
    x: Number.MIN_SAFE_INTEGER,
    y: Number.MIN_SAFE_INTEGER,
  };

  for (const line of lines) {
    const points = line.split(" -> ").map((p) => {
      const [x, y] = p.split(",").map((n) => Number(n));
      return { x, y };
    });

    topLeft.x = Math.min(topLeft.x, points[0].x);
    topLeft.y = Math.min(topLeft.y, points[0].y);
    bottomRight.x = Math.max(bottomRight.x, points[0].x);
    bottomRight.y = Math.max(bottomRight.y, points[0].y);

    for (let index = 0; index < points.length - 1; index++) {
      topLeft.x = Math.min(topLeft.x, points[index + 1].x);
      topLeft.y = Math.min(topLeft.y, points[index + 1].y);
      bottomRight.x = Math.max(bottomRight.x, points[index + 1].x);
      bottomRight.y = Math.max(bottomRight.y, points[index + 1].y);

      if (points[index].x === points[index + 1].x) {
        const min = Math.min(points[index].y, points[index + 1].y);
        const max = Math.max(points[index].y, points[index + 1].y);
        const x = points[index].x;
        for (let y = min; y <= max; y++) {
          cells.add(`${x},${y}`);
        }
      } else {
        const min = Math.min(points[index].x, points[index + 1].x);
        const max = Math.max(points[index].x, points[index + 1].x);
        const y = points[index].y;
        for (let x = min; x <= max; x++) {
          cells.add(`${x},${y}`);
        }
      }
    }
  }

  const grid: Grid = {
    topLeft,
    bottomRight,
    cells,
    hasFloor: false,
  };

  let sandCount = 0;
  while (true) {
    if (dropSand(grid)) {
      sandCount++;
    } else {
      break;
    }
  }
  console.log(`Day 14a: ${sandCount}`);
};

const day14b = async () => {
  const inputFile = await Deno.readTextFile("input/day-14.txt");
  const lines = inputFile.split("\n");

  const cells = new Set<string>();
  const topLeft = {
    x: Number.MAX_SAFE_INTEGER,
    y: Number.MAX_SAFE_INTEGER,
  };
  const bottomRight = {
    x: Number.MIN_SAFE_INTEGER,
    y: Number.MIN_SAFE_INTEGER,
  };

  for (const line of lines) {
    const points = line.split(" -> ").map((p) => {
      const [x, y] = p.split(",").map((n) => Number(n));
      return { x, y };
    });

    topLeft.x = Math.min(topLeft.x, points[0].x);
    topLeft.y = Math.min(topLeft.y, points[0].y);
    bottomRight.x = Math.max(bottomRight.x, points[0].x);
    bottomRight.y = Math.max(bottomRight.y, points[0].y);

    for (let index = 0; index < points.length - 1; index++) {
      topLeft.x = Math.min(topLeft.x, points[index + 1].x);
      topLeft.y = Math.min(topLeft.y, points[index + 1].y);
      bottomRight.x = Math.max(bottomRight.x, points[index + 1].x);
      bottomRight.y = Math.max(bottomRight.y, points[index + 1].y);

      if (points[index].x === points[index + 1].x) {
        const min = Math.min(points[index].y, points[index + 1].y);
        const max = Math.max(points[index].y, points[index + 1].y);
        const x = points[index].x;
        for (let y = min; y <= max; y++) {
          cells.add(`${x},${y}`);
        }
      } else {
        const min = Math.min(points[index].x, points[index + 1].x);
        const max = Math.max(points[index].x, points[index + 1].x);
        const y = points[index].y;
        for (let x = min; x <= max; x++) {
          cells.add(`${x},${y}`);
        }
      }
    }
  }

  const grid: Grid = {
    topLeft,
    bottomRight,
    cells,
    hasFloor: true,
  };

  let sandCount = 0;
  while (true) {
    if (dropSand(grid)) {
      sandCount++;
    } else {
      break;
    }
  }
  console.log(`Day 14b: ${sandCount}`);
};
if (import.meta.main) {
  await day14a();
  await day14b();
}
