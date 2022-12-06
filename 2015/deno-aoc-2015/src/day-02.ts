const day02a = async () => {
  const inputFile = await Deno.readTextFile("input/day-02.txt");
  const lines = inputFile.split("\n", -1);

  let total = 0;

  for (const line of lines) {
    const [l, w, h] = line
      .split("x", -1)
      .map((x) => Number(x))
      .sort((a, b) => a - b);

    const area = 2 * l * w + 2 * w * h + 2 * h * l + l * w;

    total += area;
  }

  console.log(`Day 2a: The total area is ${total}`);
};

const day02b = async () => {
  const inputFile = await Deno.readTextFile("input/day-02.txt");
  const lines = inputFile.split("\n", -1);

  let total = 0;

  for (const line of lines) {
    const [l, w, h] = line
      .split("x", -1)
      .map((x) => Number(x))
      .sort((a, b) => a - b);

    const ribbon = l + l + w + w + l * w * h;

    total += ribbon;
  }

  console.log(`Day 2b: The total ribbon length is ${total}`);
};

if (import.meta.main) {
  await day02a();
  await day02b();
}
