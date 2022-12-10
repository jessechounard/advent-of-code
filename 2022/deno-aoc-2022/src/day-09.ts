type Position = {
  x: number;
  y: number;
};

enum Direction {
  Up = "U",
  Down = "D",
  Left = "L",
  Right = "R",
}

function createPositions(n: number): Position[] {
  const positions: Position[] = [];
  for (let i = 0; i < n; i++) {
    positions.push({ x: 0, y: 0 });
  }
  return positions;
}

function processMove(positions: Position[], direction: Direction) {
  if (!positions || positions.length < 1) {
    return;
  }

  positions[0].x +=
    direction === Direction.Left ? -1 : direction === Direction.Right ? 1 : 0;
  positions[0].y +=
    direction === Direction.Up ? -1 : direction === Direction.Down ? 1 : 0;

  for (let i = 1; i < positions.length; i++) {
    const dx = Math.abs(positions[i - 1].x - positions[i].x);
    const dy = Math.abs(positions[i - 1].y - positions[i].y);

    if (dx > 1 || dy > 1) {
      const sx = Math.sign(positions[i - 1].x - positions[i].x);
      const sy = Math.sign(positions[i - 1].y - positions[i].y);

      positions[i].x += sx;
      positions[i].y += sy;
    }
  }
}

const day09a = async () => {
  const inputFile = await Deno.readTextFile("input/day-09.txt");
  const lines = inputFile.split("\n", -1);

  const positions = createPositions(2);

  const tail = positions[positions.length - 1];

  const tailPositions: Set<string> = new Set();
  tailPositions.add(JSON.stringify(tail));

  for (const line of lines) {
    const segments = line.split(" ", -1);
    const steps = Number(segments[1]);
    const direction = segments[0] as Direction;

    for (let step = 0; step < steps; step++) {
      processMove(positions, direction);
      tailPositions.add(JSON.stringify(tail));
    }
  }

  console.log(`Day 9a: ${tailPositions.size}`);
};

const day09b = async () => {
  const inputFile = await Deno.readTextFile("input/day-09.txt");
  const lines = inputFile.split("\n", -1);

  const positions = createPositions(10);

  const tail = positions[positions.length - 1];

  const tailPositions: Set<string> = new Set();
  tailPositions.add(JSON.stringify(tail));

  for (const line of lines) {
    const segments = line.split(" ", -1);
    const steps = Number(segments[1]);
    const direction = segments[0] as Direction;

    for (let step = 0; step < steps; step++) {
      processMove(positions, direction);
      tailPositions.add(JSON.stringify(tail));
    }
  }

  console.log(`Day 9b: ${tailPositions.size}`);
};

if (import.meta.main) {
  await day09a();
  await day09b();
}
