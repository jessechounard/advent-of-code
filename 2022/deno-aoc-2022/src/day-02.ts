const ROCK = 0;
const PAPER = 1;
const SCISSORS = 2;

const LOSS = 0;
const DRAW = 1;
const WIN = 2;

const handPoints = [1, 2, 3];
const resultPoints = [0, 3, 6];

function getHand(input: string): number {
  if (input === "A" || input === "X") {
    return ROCK;
  } else if (input === "B" || input === "Y") {
    return PAPER;
  }
  return SCISSORS;
}

function getResult(theirs: number, ours: number) {
  if (theirs === ours) {
    return DRAW;
  } else if (theirs == (ours + 1) % 3) {
    return LOSS;
  }
  return WIN;
}

function getForcedResult(input: string, theirHand: number): [number, number] {
  if (input === "X") {
    return [LOSS, getLoser(theirHand)];
  } else if (input === "Y") {
    return [DRAW, theirHand];
  }
  return [WIN, getBeater(theirHand)];
}

function getBeater(input: number): number {
  return (input + 1) % 3;
}

function getLoser(input: number): number {
  return (input + 2) % 3;
}

const day02a = async () => {
  const inputFile = await Deno.readTextFile("input/day-02.txt");
  const lines = inputFile.split("\n", -1);

  let score = 0;

  for (const line of lines) {
    const characters = line.split(" ", -1);

    const theirHand = getHand(characters[0]);
    const ourHand = getHand(characters[1]);
    const result = getResult(theirHand, ourHand);

    score += resultPoints[result] + handPoints[ourHand];
  }

  console.log(`Day 2a score: ${score}`);
};

const day02b = async () => {
  const inputFile = await Deno.readTextFile("input/day-02.txt");
  const lines = inputFile.split("\n", -1);

  let score = 0;

  for (const line of lines) {
    const characters = line.split(" ", -1);

    const theirHand = getHand(characters[0]);
    const [result, ourHand] = getForcedResult(characters[1], theirHand);

    score += resultPoints[result] + handPoints[ourHand];
  }

  console.log(`Day 2b score: ${score}`);
};

if (import.meta.main) {
  await day02a();
  await day02b();
}
