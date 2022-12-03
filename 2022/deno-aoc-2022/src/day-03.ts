function isLowerCase(s: string): boolean {
  return s.charAt(0) === s.charAt(0).toLowerCase();
}

const day03a = async () => {
  const inputFile = await Deno.readTextFile("input/day-03.txt");
  const lines = inputFile.split("\n", -1);

  let sum = 0;

  const lowercase = "a".charCodeAt(0);
  const uppercase = "A".charCodeAt(0);

  for (const line of lines) {
    const ruckSize = line.length / 2;
    const first = line.substring(0, ruckSize);
    const second = line.substring(ruckSize);

    for (const c of first) {
      if (second.includes(c)) {
        if (isLowerCase(c)) {
          sum += c.charCodeAt(0) - lowercase + 1;
        } else {
          sum += c.charCodeAt(0) - uppercase + 27;
        }
        break;
      }
    }
  }

  console.log(`Day 3a sum: ${sum}`);
};

const day03b = async () => {
  const inputFile = await Deno.readTextFile("input/day-03.txt");
  const lines = inputFile.split("\n", -1);

  let sum = 0;

  const lowercase = "a".charCodeAt(0);
  const uppercase = "A".charCodeAt(0);

  for (let i = 0; i < lines.length; i += 3) {
    const first = lines[i];
    const second = lines[i + 1];
    const third = lines[i + 2];

    for (const c of first) {
      if (second.includes(c) && third.includes(c)) {
        if (isLowerCase(c)) {
          sum += c.charCodeAt(0) - lowercase + 1;
        } else {
          sum += c.charCodeAt(0) - uppercase + 27;
        }
        break;
      }
    }
  }

  console.log(`Day 3b sum: ${sum}`);
};

if (import.meta.main) {
  await day03a();
  await day03b();
}
