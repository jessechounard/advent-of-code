type Data = {
  offset: number;
  originalIndex: number;
};

function parseInput(input: string): Data[] {
  let index = 0;
  return input.split("\n").map((n) => {
    return { offset: Number(n), originalIndex: index++ };
  });
}

function mix(data: Data[]) {
  let index = 0;
  let position = data.findIndex((d) => d.originalIndex === index);
  index++;

  while (position !== -1) {
    let newPosition = (position + data[position].offset) % (data.length - 1);
    while (newPosition < 0) {
      newPosition += data.length - 1;
    }

    if (position !== newPosition) {
      const temp = data.splice(position, 1)[0];
      data.splice(newPosition, 0, temp);
    }

    position = data.findIndex((d) => d.originalIndex === index);
    index++;
  }
}

const day20a = async () => {
  const input = await Deno.readTextFile("input/day-20.txt");
  const data = parseInput(input);

  mix(data);

  let sum = 0;
  const position = data.findIndex((d) => d.offset === 0);
  if (position !== -1) {
    const first = data[(position + 1000) % data.length];
    const second = data[(position + 2000) % data.length];
    const third = data[(position + 3000) % data.length];
    sum = first.offset + second.offset + third.offset;
  }

  console.log(`Day 20a ${sum}`);
};

const day20b = async () => {
  const input = await Deno.readTextFile("input/day-20.txt");
  const data = parseInput(input).map((d) => {
    return {
      offset: d.offset * 811589153,
      originalIndex: d.originalIndex,
    };
  });

  for (let i = 0; i < 10; i++) {
    mix(data);
  }

  let sum = 0;
  const position = data.findIndex((d) => d.offset === 0);
  if (position !== -1) {
    const first = data[(position + 1000) % data.length];
    const second = data[(position + 2000) % data.length];
    const third = data[(position + 3000) % data.length];
    sum = first.offset + second.offset + third.offset;
  }

  console.log(`Day 20a ${sum}`);
};

if (import.meta.main) {
  await day20a();
  await day20b();
}
