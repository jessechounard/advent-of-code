function setBit(input: number, index: number): number {
  const bit = 1 << (index - 1);
  return input | bit;
}

function checkBit(input: number, index: number): boolean {
  const bit = 1 << (index - 1);
  return (input & bit) != 0;
}

type CompressedConnection = { distance: number; name: string };

function parseInput(
  input: string
): [
  Map<string, CompressedConnection[]>,
  Map<string, number>,
  Map<string, number>
] {
  const lines = input.split("\n");
  const names: string[] = [];
  const rates = new Map<string, number>();
  const connections = new Map<string, string[]>();
  const compressedConnections = new Map<string, CompressedConnection[]>();
  const indices = new Map<string, number>();

  let index = 1;

  for (const line of lines) {
    const segments = line.split(" ");
    const name = segments[1];
    const rate = Number(segments[4].split("=")[1].split(";")[0]);
    const localConnections = segments.slice(9).map((s) => s.split(",")[0]);

    names.push(name);
    rates.set(name, rate);
    connections.set(name, localConnections);
    if (rate > 0 || name === "AA") {
      indices.set(name, index++);
    }
  }

  for (const name of names) {
    if (rates.get(name) === 0 && name !== "AA") {
      continue;
    }

    const visited = [name];
    const visitQueue = connections.get(name)!.map((c) => {
      return {
        distance: 1,
        name: c,
      };
    });

    const distances: CompressedConnection[] = [];

    while (visitQueue.length > 0) {
      const current = visitQueue[0];
      visitQueue.shift();

      if (visited.includes(current.name)) {
        continue;
      }

      visited.push(current.name);

      if (rates.get(current.name) !== 0) {
        distances.push(current);
      }

      for (const nextName of connections.get(current.name)!) {
        visitQueue.push({ distance: current.distance + 1, name: nextName });
      }
    }

    compressedConnections.set(name, distances);
  }

  if (indices.size > 32) {
    console.log(
      "This won't work, we can't handle more than 32 valves. Switch to bigint"
    );
  }

  return [compressedConnections, rates, indices];
}

function exploreTunnels(
  tunnelConnections: Map<string, CompressedConnection[]>,
  rates: Map<string, number>,
  indices: Map<string, number>,
  name: string,
  visited: number,
  time: number
): number {
  let max = Number.MIN_SAFE_INTEGER;

  for (const connection of tunnelConnections.get(name)!) {
    if (checkBit(visited, indices.get(connection.name)!)) {
      continue;
    }

    const remainingTime = time - connection.distance - 1;
    const increase = remainingTime * rates.get(connection.name)!;
    if (increase <= 0) {
      continue;
    }

    max = Math.max(
      max,
      increase +
        exploreTunnels(
          tunnelConnections,
          rates,
          indices,
          connection.name,
          setBit(visited, indices.get(connection.name)!),
          remainingTime
        )
    );
  }

  return Math.max(max, 0);
}

const day16a = async () => {
  const input = await Deno.readTextFile("input/day-16.txt");
  const [tunnelConnections, rates, indices] = parseInput(input);

  const pressure = exploreTunnels(
    tunnelConnections,
    rates,
    indices,
    "AA",
    setBit(0, indices.get("AA")!),
    30
  );

  console.log(`Day 16a ${pressure}`);
};

const day16b = async () => {
  const input = await Deno.readTextFile("input/day-16.txt");
  const [tunnelConnections, rates, indices] = parseInput(input);

  const maxTest = 1 << indices.size;
  const testMask = 0xffffffff >> (32 - indices.size);

  let maxPressure = Number.MIN_SAFE_INTEGER;

  for (let i = 0; i < maxTest; i++) {
    const myVisited = i;
    const partnerVisited = ~myVisited & testMask;

    const myPressure = exploreTunnels(
      tunnelConnections,
      rates,
      indices,
      "AA",
      setBit(partnerVisited, indices.get("AA")!),
      26
    );
    const partnerPressure = exploreTunnels(
      tunnelConnections,
      rates,
      indices,
      "AA",
      setBit(myVisited, indices.get("AA")!),
      26
    );

    maxPressure = Math.max(maxPressure, myPressure + partnerPressure);
  }

  console.log(`Day 16b ${maxPressure}`);
};

if (import.meta.main) {
  await day16a();
  await day16b();
}
