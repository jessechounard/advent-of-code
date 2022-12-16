type Sensor = {
  sx: number;
  sy: number;
  bx: number;
  by: number;
  distance: number;
};

type Range = {
  start: number;
  end: number;
  invalidated?: boolean;
};

function manhattanDistance(
  x: number,
  y: number,
  dx: number,
  dy: number
): number {
  return Math.abs(x - dx) + Math.abs(y - dy);
}

function combineRanges(ranges: Range[]): Range[] {
  while (true) {
    let merged = false;
    for (let first = 0; first < ranges.length - 1; first++) {
      const a = ranges[first];
      if (a.invalidated) {
        continue;
      }

      for (let second = 0; second < ranges.length; second++) {
        const b = ranges[second];
        if (first == second || b.invalidated) {
          continue;
        }

        if (
          (a.end >= b.start && b.end >= a.start) ||
          a.end + 1 === b.start ||
          b.end + 1 === a.start
        ) {
          a.start = Math.min(a.start, b.start);
          a.end = Math.max(a.end, b.end);
          b.invalidated = true;
          merged = true;
        }
      }
    }
    if (!merged) {
      break;
    }
  }

  const result: Range[] = [];
  for (const range of ranges) {
    if (range.invalidated) {
      continue;
    }
    result.push({ ...range });
  }

  return result;
}

const day15a = async () => {
  const inputFile = await Deno.readTextFile("input/day-15.txt");
  const lines = inputFile.split("\n");
  const regex = /[-]{0,1}[\d]*[.]{0,1}[\d]+/g;

  const sensors: Sensor[] = [];
  let minBx = Number.MAX_SAFE_INTEGER;
  let maxBx = Number.MIN_SAFE_INTEGER;

  for (const line of lines) {
    const [sx, sy, bx, by] = line.match(regex)!.map((n) => Number(n));
    const distance = manhattanDistance(sx, sy, bx, by);

    sensors.push({
      sx,
      sy,
      bx,
      by,
      distance,
    });

    minBx = Math.min(minBx, sx - distance);
    maxBx = Math.max(maxBx, sx + distance);
  }

  let count = 0;
  const y = 2000000;
  for (let x = minBx; x <= maxBx; x++) {
    for (const sensor of sensors) {
      if (sensor.bx === x && sensor.by === y) {
        break;
      }
      if (manhattanDistance(x, y, sensor.sx, sensor.sy) <= sensor.distance) {
        count++;
        break;
      }
    }
  }

  console.log(`Day 15a ${count}`);
};

const day15b = async () => {
  const inputFile = await Deno.readTextFile("input/day-15.txt");
  const lines = inputFile.split("\n");
  const regex = /[-]{0,1}[\d]*[.]{0,1}[\d]+/g;

  const sensors: Sensor[] = [];
  let missingX = 0n;
  let missingY = 0n;

  for (const line of lines) {
    const [sx, sy, bx, by] = line.match(regex)!.map((n) => Number(n));
    const distance = manhattanDistance(sx, sy, bx, by);

    sensors.push({
      sx,
      sy,
      bx,
      by,
      distance,
    });
  }

  for (let y = 0; y <= 4000000; y++) {
    const ranges: Range[] = [];
    for (const sensor of sensors) {
      const distance = sensor.distance - Math.abs(sensor.sy - y);
      if (distance <= 0) {
        continue;
      }
      ranges.push({
        start: Math.max(0, sensor.sx - distance),
        end: Math.min(4000000, sensor.sx + distance),
      });
    }
    const combinedRanges = combineRanges(ranges);
    if (combinedRanges[0].start !== 0 || combinedRanges[0].end !== 4000000) {
      missingY = BigInt(y);

      if (combinedRanges.length === 1) {
        if (combinedRanges[0].start !== 0) {
          missingX = BigInt(0);
        } else {
          missingX = BigInt(4000000);
        }
      } else if (combinedRanges.length === 2) {
        if (combinedRanges[0].start === 0) {
          missingX = BigInt(combinedRanges[0].end + 1);
        } else {
          missingX = BigInt(combinedRanges[0].start - 1);
        }
      }
      break;
    }
  }

  console.log(`Day 15b ${missingX * 4000000n + missingY}`);
};

if (import.meta.main) {
  await day15a();
  await day15b();
}
