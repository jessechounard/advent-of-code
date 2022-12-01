const sortedElfList = async (): Promise<number[]> => {
  const inputFile = await Deno.readTextFile("input/day-01.txt");
  const lines = inputFile.split("\n", -1);

  let total = 0;
  const list: number[] = [];

  for (const line of lines) {
    if (line === "") {
      list.push(total);
      total = 0;
    } else {
      total += Number(line);
    }
  }

  list.push(total);
  return list.sort((a, b) => b - a);
};

const day01a = async () => {
  const elfList = await sortedElfList();
  console.log(`The elf carrying the most has ${elfList[0]} calories.`);
};

const day01b = async () => {
  const elfList = await sortedElfList();
  console.log(
    `The top three elves are carrying ${
      elfList[0] + elfList[1] + elfList[2]
    } calories.`
  );
};

if (import.meta.main) {
  await day01a();
  await day01b();
}
