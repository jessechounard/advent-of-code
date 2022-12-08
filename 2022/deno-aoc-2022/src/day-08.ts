const day08a = async () => {
  const inputFile = await Deno.readTextFile("input/day-08.txt");
  const lines = inputFile.split("\n", -1);

  const grid: number[][] = [];

  for (const line of lines) {
    grid.push(line.split("").map((x) => Number(x)));
  }

  let visible = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      let leftVisible = true;
      for (let s = x - 1; s >= 0; s--) {
        if (grid[y][s] >= grid[y][x]) {
          leftVisible = false;
          break;
        }
      }

      let rightVisible = true;
      for (let s = x + 1; s < grid[0].length; s++) {
        if (grid[y][s] >= grid[y][x]) {
          rightVisible = false;
          break;
        }
      }

      let upVisible = true;
      for (let s = y - 1; s >= 0; s--) {
        if (grid[s][x] >= grid[y][x]) {
          upVisible = false;
          break;
        }
      }

      let downVisible = true;
      for (let s = y + 1; s < grid[0].length; s++) {
        if (grid[s][x] >= grid[y][x]) {
          downVisible = false;
          break;
        }
      }

      if (leftVisible || rightVisible || upVisible || downVisible) {
        visible++;
      }
    }
  }
  console.log(`Day 8a: ${visible}`);
};

const day08b = async () => {
  const inputFile = await Deno.readTextFile("input/day-08.txt");
  const lines = inputFile.split("\n", -1);

  const grid: number[][] = [];

  for (const line of lines) {
    grid.push(line.split("").map((x) => Number(x)));
  }

  let maxScore = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      let leftVisible = 0;
      for (let s = x - 1; s >= 0; s--) {
        leftVisible++;
        if (grid[y][s] >= grid[y][x]) {
          break;
        }
      }

      let rightVisible = 0;
      for (let s = x + 1; s < grid[0].length; s++) {
        rightVisible++;
        if (grid[y][s] >= grid[y][x]) {
          break;
        }
      }

      let upVisible = 0;
      for (let s = y - 1; s >= 0; s--) {
        upVisible++;
        if (grid[s][x] >= grid[y][x]) {
          break;
        }
      }

      let downVisible = 0;
      for (let s = y + 1; s < grid[0].length; s++) {
        downVisible++;
        if (grid[s][x] >= grid[y][x]) {
          break;
        }
      }

      const score = leftVisible * rightVisible * upVisible * downVisible;

      if (score > maxScore) {
        maxScore = score;
      }
    }
  }
  console.log(`Day 8b: ${maxScore}`);
};

if (import.meta.main) {
  await day08a();
  await day08b();
}
