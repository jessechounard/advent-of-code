function allDifferent(s: string, index: number, count: number): boolean {
  const set = new Set();
  for (let i = index; i < index + count; i++) {
    set.add(s[i]);
  }
  return set.size == count;
}

const day06a = async () => {
  const inputFile = await Deno.readTextFile("input/day-06.txt");
  const count = 4;

  for (let i = 0; i < inputFile.length - count; i++) {
    if (allDifferent(inputFile, i, count)) {
      console.log(i + count);
      return;
    }
  }
};

const day06b = async () => {
  const inputFile = await Deno.readTextFile("input/day-06.txt");
  const count = 14;

  for (let i = 0; i < inputFile.length - count; i++) {
    if (allDifferent(inputFile, i, count)) {
      console.log(i + count);
      return;
    }
  }
};

if (import.meta.main) {
  await day06a();
  await day06b();
}
