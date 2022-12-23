// note: These values are used as array indices
const Resource = {
  Ore: 0,
  Clay: 1,
  Obsidian: 2,
  Geode: 3,
} as const;

type Resource = typeof Resource[keyof typeof Resource];

type Blueprint = {
  id: number;
  costs: number[][];
  maximums: number[];
};

function getMaxGeodes(
  blueprint: Blueprint,
  time: number,
  robots: number[],
  resources: number[]
): number {
  return geodeDFS(blueprint, time, robots, resources, [0]);
}

function geodeDFS(
  blueprint: Blueprint,
  time: number,
  robots: number[],
  resources: number[],
  cache: number[]
): number {
  // if cache[0] (highest geode count seen) is higher than
  // what we could theoretically generate, exit early.
  // We're using triangle number to generate max geodes,
  // this too high, so suboptimal, but good enough for now
  cache[0] = Math.max(cache[0], resources[Resource.Geode]);
  if (
    cache[0] >=
    resources[Resource.Geode] +
      robots[Resource.Geode] * time +
      (time * time - time) / 2
  ) {
    // this is pretty hacky. cache[0] is the maximum geodes we've seen
    return cache[0];
  }

  if (time === 0) {
    return resources[Resource.Geode];
  }

  // if we build no robots, this is the minumum geodes we'd have
  let maxGeodes = resources[Resource.Geode] + robots[Resource.Geode] * time;

  for (let robotType = 0; robotType < 4; robotType++) {
    if (
      robotType != Resource.Geode &&
      robots[robotType] >= blueprint.maximums[robotType]
    ) {
      continue;
    }

    // figure out how long it will take to build this robot
    let waitTime = 0;
    let skipBuild = false;

    for (let resourceType = 0; resourceType < 3; resourceType++) {
      if (blueprint.costs[robotType][resourceType] === 0) {
        continue;
      } else if (robots[resourceType] === 0) {
        skipBuild = true;
        break;
      }

      waitTime = Math.max(
        waitTime,
        Math.ceil(
          (blueprint.costs[robotType][resourceType] - resources[resourceType]) /
            robots[resourceType]
        )
      );

      if (waitTime + 1 >= time) {
        skipBuild = true;
        break;
      }
    }

    if (!skipBuild) {
      const timeElapsed = waitTime + 1;
      const nextTime = time - timeElapsed;
      const nextResources = [...resources];
      const nextRobots = [...robots];

      nextRobots[robotType]++;
      for (let i = 0; i < 4; i++) {
        nextResources[i] -= blueprint.costs[robotType][i];
        nextResources[i] += robots[i] * timeElapsed;
      }

      maxGeodes = Math.max(
        maxGeodes,
        geodeDFS(blueprint, nextTime, nextRobots, nextResources, cache)
      );
    }
  }

  return maxGeodes;
}

function parseInput(input: string): Blueprint[] {
  const lines = input.split("\n");
  const blueprints: Blueprint[] = [];

  for (const line of lines) {
    const segments = line.split(" ");
    const id = Number(segments[1].split(":")[0]);
    const oreRobotCost = [Number(segments[6]), 0, 0, 0];
    const clayRobotCost = [Number(segments[12]), 0, 0, 0];
    const obsidianRobotCost = [
      Number(segments[18]),
      Number(segments[21]),
      0,
      0,
    ];
    const geodeRobotCost = [Number(segments[27]), 0, Number(segments[30]), 0];

    const maximums = [
      Math.max(
        oreRobotCost[0],
        clayRobotCost[0],
        obsidianRobotCost[0],
        geodeRobotCost[0]
      ),
      Math.max(
        oreRobotCost[1],
        clayRobotCost[1],
        obsidianRobotCost[1],
        geodeRobotCost[1]
      ),
      Math.max(
        oreRobotCost[2],
        clayRobotCost[2],
        obsidianRobotCost[2],
        geodeRobotCost[2]
      ),
      0,
    ];

    blueprints.push({
      id,
      costs: [oreRobotCost, clayRobotCost, obsidianRobotCost, geodeRobotCost],
      maximums,
    });
  }

  return blueprints;
}

const day19a = async () => {
  const input = await Deno.readTextFile("input/day-19.txt");
  const blueprints = parseInput(input);

  const maxGeodes = blueprints.reduce(
    (score, blueprint) =>
      score +
      getMaxGeodes(blueprint, 24, [1, 0, 0, 0], [0, 0, 0, 0]) * blueprint.id,
    0
  );

  console.log(`Day 19a ${maxGeodes}`);
};

const day19b = async () => {
  const input = await Deno.readTextFile("input/day-19.txt");
  const blueprints = parseInput(input);

  const maxGeodes = blueprints
    .slice(0, 3)
    .reduce(
      (score, blueprint) =>
        score * getMaxGeodes(blueprint, 32, [1, 0, 0, 0], [0, 0, 0, 0]),
      1
    );

  console.log(`Day 19b ${maxGeodes}`);
};

if (import.meta.main) {
  await day19a();
  await day19b();
}
