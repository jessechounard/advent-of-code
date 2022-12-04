const day04a = async () => {
  const inputFile = await Deno.readTextFile("input/day-04.txt");
  const lines = inputFile.split("\n", -1);

  let count = 0;

  for (const line of lines) {
    const segments = line.split(",", -1);
    const span0 = segments[0].split("-", -1).map((s) => Number(s));
    const span1 = segments[1].split("-", -1).map((s) => Number(s));

    if (
      (span0[0] >= span1[0] && span0[1] <= span1[1]) ||
      (span1[0] >= span0[0] && span1[1] <= span0[1])
    ) {
      count++;
    }
  }

  console.log(`Day 4a total ${count}`);
};

const day04b = async () => {
  const inputFile = await Deno.readTextFile("input/day-04.txt");
  const lines = inputFile.split("\n", -1);

  let count = 0;

  for (const line of lines) {
    const segments = line.split(",", -1);
    const span0 = segments[0].split("-", -1).map((s) => Number(s));
    const span1 = segments[1].split("-", -1).map((s) => Number(s));

    if (span0[1] >= span1[0] && span0[0] <= span1[1]) {
      count++;
    }
  }

  console.log(`Day 4b total ${count}`);
};

if (import.meta.main) {
  await day04a();
  await day04b();
}
