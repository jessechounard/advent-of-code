const day05a = async () => {
  const stacks: string[] = [
    "BVSNTCHQ",
    "WDBG",
    "FWRTSQB",
    "LGWSZJDN",
    "MPDVF",
    "FWJ",
    "LNQBJV",
    "GTRCJQSN",
    "JSQCWDM",
  ];

  const inputFile = await Deno.readTextFile("input/day-05.txt");
  const lines = inputFile.split("\n", -1);

  for (const line of lines) {
    const segments = line.split(" ", -1);
    const count = Number(segments[1]);
    const fromStack = Number(segments[3]) - 1;
    const toStack = Number(segments[5]) - 1;

    for (let i = 0; i < count; i++) {
      const c = stacks[fromStack].charAt(stacks[fromStack].length - 1);
      stacks[fromStack] = stacks[fromStack].slice(0, -1);
      stacks[toStack] += c;
    }
  }

  let output = "";
  for (const stack of stacks) {
    output += stack.charAt(stack.length - 1);
  }

  console.log(output);
};

const day05b = async () => {
  const stacks: string[] = [
    "BVSNTCHQ",
    "WDBG",
    "FWRTSQB",
    "LGWSZJDN",
    "MPDVF",
    "FWJ",
    "LNQBJV",
    "GTRCJQSN",
    "JSQCWDM",
  ];

  const inputFile = await Deno.readTextFile("input/day-05.txt");
  const lines = inputFile.split("\n", -1);

  for (const line of lines) {
    const segments = line.split(" ", -1);
    const count = Number(segments[1]);
    const fromStack = Number(segments[3]) - 1;
    const toStack = Number(segments[5]) - 1;

    const chunk = stacks[fromStack].slice(stacks[fromStack].length - count);
    stacks[fromStack] = stacks[fromStack].slice(0, -count);
    stacks[toStack] += chunk;
  }

  let output = "";
  for (const stack of stacks) {
    output += stack.charAt(stack.length - 1);
  }

  console.log(output);
};

if (import.meta.main) {
  await day05a();
  await day05b();
}
