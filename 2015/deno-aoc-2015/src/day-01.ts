const day01a = async () => {
  const inputFile = await Deno.readTextFile("input/day-01.txt");

  let floor = 0;

  for (const c of inputFile) {
    if (c === "(") {
      floor++;
    } else if (c === ")") {
      floor--;
    }
  }

  console.log(`Day 1a: The final floor is ${floor}`);
};

const day01b = async () => {
  const inputFile = await Deno.readTextFile("input/day-01.txt");

  let floor = 0;

  for (let i = 0; i < inputFile.length; i++) {
    const c = inputFile[i];
    if (c === "(") {
      floor++;
    } else if (c === ")") {
      floor--;
    }

    if (floor === -1) {
      console.log(`Day 1b: The position is ${i + 1}`);
      break;
    }
  }
};

if (import.meta.main) {
  await day01a();
  await day01b();
}
