enum Instruction {
  noop = "noop",
  addx = "addx",
}

const day10a = async () => {
  const inputFile = await Deno.readTextFile("input/day-10.txt");
  const lines = inputFile.split("\n", -1);

  let cycle = 0;
  let register = 1;
  let signalStrength = 0;
  let addDelayCycles = 0;
  let addValue = 0;
  let currentInstruction = 0;
  const signalStrengthCycles = [20, 60, 100, 140, 180, 220];

  while (true) {
    cycle++;
    if (cycle > 220) {
      break;
    }

    if (signalStrengthCycles.includes(cycle)) {
      signalStrength += cycle * register;
    }

    if (addDelayCycles > 0) {
      addDelayCycles--;
      if (addDelayCycles === 0) {
        register += addValue;
      }
    } else {
      if (currentInstruction < lines.length) {
        const segments = lines[currentInstruction].split(" ", -1);
        currentInstruction++;

        const instruction = segments[0] as Instruction;

        if (instruction == Instruction.addx) {
          addDelayCycles = 1;
          addValue = Number(segments[1]);
        }
        // ignore noop instruction
      }
    }
  }

  console.log(`Day 10a: ${signalStrength}`);
};

const day10b = async () => {
  const inputFile = await Deno.readTextFile("input/day-10.txt");
  const lines = inputFile.split("\n", -1);

  let cycle = 0;
  let register = 1;
  let addDelayCycles = 0;
  let addValue = 0;
  let currentInstruction = 0;
  let outputString = "";

  while (true) {
    cycle++;
    if (cycle > 240) {
      break;
    }

    const currentPixel = (cycle - 1) % 40;
    if (Math.abs(register - currentPixel) <= 1) {
      outputString += "#";
    } else {
      outputString += ".";
    }

    if (addDelayCycles > 0) {
      addDelayCycles--;
      if (addDelayCycles === 0) {
        register += addValue;
      }
    } else {
      if (currentInstruction < lines.length) {
        const segments = lines[currentInstruction].split(" ", -1);
        currentInstruction++;

        const instruction = segments[0] as Instruction;

        if (instruction == Instruction.addx) {
          addDelayCycles = 1;
          addValue = Number(segments[1]);
        }
        // ignore noop instruction
      }
    }
  }

  const line1 = outputString.slice(0, 40);
  const line2 = outputString.slice(40, 80);
  const line3 = outputString.slice(80, 120);
  const line4 = outputString.slice(120, 160);
  const line5 = outputString.slice(160, 200);
  const line6 = outputString.slice(200, 240);

  console.log(`Day 10b:`);
  console.log(line1);
  console.log(line2);
  console.log(line3);
  console.log(line4);
  console.log(line5);
  console.log(line6);
};

if (import.meta.main) {
  await day10a();
  await day10b();
}
