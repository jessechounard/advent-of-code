const day18a = async () => {
  const input = await Deno.readTextFile("input/day-18.txt");
  const lines = input.split("\n");
  const cubes = new Set<string>(lines);

  let sideCount = 0;

  for (const cube of cubes) {
    const [x, y, z] = cube.split(",").map((n) => Number(n));

    if (!cubes.has(`${x + 1},${y},${z}`)) {
      sideCount++;
    }
    if (!cubes.has(`${x - 1},${y},${z}`)) {
      sideCount++;
    }
    if (!cubes.has(`${x},${y + 1},${z}`)) {
      sideCount++;
    }
    if (!cubes.has(`${x},${y - 1},${z}`)) {
      sideCount++;
    }
    if (!cubes.has(`${x},${y},${z + 1}`)) {
      sideCount++;
    }
    if (!cubes.has(`${x},${y},${z - 1}`)) {
      sideCount++;
    }
  }

  console.log(`Day 18b ${sideCount}`);
};

const day18b = async () => {
  const input = await Deno.readTextFile("input/day-18.txt");
  const cubes: number[][] = input
    .split("\n")
    .map((l) => l.split(",").map((n) => Number(n) + 1));

  let mx = 0;
  let my = 0;
  let mz = 0;

  for (const cube of cubes) {
    mx = Math.max(mx, cube[0]);
    my = Math.max(my, cube[1]);
    mz = Math.max(mz, cube[2]);
  }

  const grid: number[][][] = [];
  for (let z = 0; z <= mz + 1; z++) {
    grid.push([]);
    for (let y = 0; y <= my + 1; y++) {
      grid[z].push([]);
      for (let x = 0; x <= mx + 1; x++) {
        grid[z][y].push(0);
      }
    }
  }

  for (const cube of cubes) {
    const [x, y, z] = cube;
    grid[z][y][x] = 1;
  }

  floodFillOver(grid, 0, 0, 0, 0, 2);

  let sideCount = 0;

  for (const cube of cubes) {
    const [x, y, z] = cube;
    if (grid[z + 1][y][x] === 2) {
      sideCount++;
    }
    if (grid[z - 1][y][x] === 2) {
      sideCount++;
    }
    if (grid[z][y + 1][x] === 2) {
      sideCount++;
    }
    if (grid[z][y - 1][x] === 2) {
      sideCount++;
    }
    if (grid[z][y][x + 1] === 2) {
      sideCount++;
    }
    if (grid[z][y][x - 1] === 2) {
      sideCount++;
    }
  }

  console.log(`Day 18b ${sideCount}`);
};

if (import.meta.main) {
  await day18a();
  await day18b();
}

function floodFillOver(
  matrix: number[][][],
  x: number,
  y: number,
  z: number,
  target: number,
  value: number
) {
  if (matrix[z][y][x] !== target) {
    return;
  }

  matrix[z][y][x] = value;

  if (x > 1) {
    floodFillOver(matrix, x - 1, y, z, target, value);
  }
  if (x < matrix[0][0].length - 1) {
    floodFillOver(matrix, x + 1, y, z, target, value);
  }
  if (y > 1) {
    floodFillOver(matrix, x, y - 1, z, target, value);
  }
  if (y < matrix[0].length - 1) {
    floodFillOver(matrix, x, y + 1, z, target, value);
  }
  if (z > 1) {
    floodFillOver(matrix, x, y, z - 1, target, value);
  }
  if (z < matrix.length - 1) {
    floodFillOver(matrix, x, y, z + 1, target, value);
  }
}
