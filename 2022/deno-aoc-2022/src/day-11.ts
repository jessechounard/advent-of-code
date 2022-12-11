enum Operand {
  add = "+",
  multiply = "*",
}

type Monkey = {
  items: number[];
  lhs: string;
  rhs: string;
  operand: Operand;
  testDivisor: number;
  trueTarget: number;
  falseTarget: number;
  inspections: number;
};

const day11a = async () => {
  const inputFile = await Deno.readTextFile("input/day-11.txt");
  const lines = inputFile.split("\n", -1);

  let current = 0;
  let items: number[] = [];
  let lhs = "";
  let rhs = "";
  let operand = Operand.add;
  let testDivisor = 1;
  let trueTarget = 0;
  let falseTarget = 0;

  const monkies: Monkey[] = [];

  for (const line of lines) {
    const segments = line.trim().split(" ", -1);

    switch (current) {
      case 0:
        // monkey number, skip and just insert at end of array
        break;
      case 1:
        items = segments.slice(2).map((x) => Number(x.split(",", -1)[0]));
        break;
      case 2:
        lhs = segments[3];
        rhs = segments[5];
        operand = segments[4] as Operand;
        break;
      case 3:
        testDivisor = Number(segments[3]);
        break;
      case 4:
        trueTarget = Number(segments[5]);
        break;
      case 5:
        falseTarget = Number(segments[5]);

        monkies.push({
          items,
          lhs,
          rhs,
          operand,
          testDivisor,
          trueTarget,
          falseTarget,
          inspections: 0,
        });
        break;
      default:
        // blank line, ignore
        break;
    }
    current = (current + 1) % 7;
  }

  for (let i = 0; i < 20; i++) {
    for (const monkey of monkies) {
      while (monkey.items.length > 0) {
        for (let index = 0; index < monkey.items.length; index++) {
          const item = monkey.items[index];
          monkey.inspections++;

          // perform the worry operation
          const lhs = monkey.lhs === "old" ? item : Number(monkey.lhs);
          const rhs = monkey.rhs === "old" ? item : Number(monkey.rhs);
          let newValue =
            monkey.operand === Operand.add
              ? lhs + rhs
              : monkey.operand === Operand.multiply
              ? lhs * rhs
              : 0;

          newValue = Math.floor(newValue / 3);

          // perform test
          const throwTarget =
            newValue % monkey.testDivisor === 0
              ? monkey.trueTarget
              : monkey.falseTarget;

          monkies[throwTarget].items.push(newValue);
        }
        monkey.items = [];
      }
    }
  }

  monkies.sort((a, b) => b.inspections - a.inspections);

  console.log(`Day 11b: ${monkies[0].inspections * monkies[1].inspections}`);
};

const day11b = async () => {
  const inputFile = await Deno.readTextFile("input/day-11.txt");
  const lines = inputFile.split("\n", -1);

  let current = 0;
  let items: number[] = [];
  let lhs = "";
  let rhs = "";
  let operand = Operand.add;
  let testDivisor = 1;
  let trueTarget = 0;
  let falseTarget = 0;

  const monkies: Monkey[] = [];

  for (const line of lines) {
    const segments = line.trim().split(" ", -1);

    switch (current) {
      case 0:
        // monkey number, skip and just insert at end of array
        break;
      case 1:
        items = segments.slice(2).map((x) => Number(x.split(",", -1)[0]));
        break;
      case 2:
        lhs = segments[3];
        rhs = segments[5];
        operand = segments[4] as Operand;
        break;
      case 3:
        testDivisor = Number(segments[3]);
        break;
      case 4:
        trueTarget = Number(segments[5]);
        break;
      case 5:
        falseTarget = Number(segments[5]);

        monkies.push({
          items,
          lhs,
          rhs,
          operand,
          testDivisor,
          trueTarget,
          falseTarget,
          inspections: 0,
        });
        break;
      default:
        // blank line, ignore
        break;
    }
    current = (current + 1) % 7;
  }

  const reducer = monkies
    .map((x) => x.testDivisor)
    .reduce((accumulator, currentValue) => accumulator * currentValue, 1);

  for (let i = 0; i < 10000; i++) {
    for (const monkey of monkies) {
      while (monkey.items.length > 0) {
        for (let index = 0; index < monkey.items.length; index++) {
          const item = monkey.items[index];
          monkey.inspections++;

          // perform the worry operation
          const lhs = monkey.lhs === "old" ? item : Number(monkey.lhs);
          const rhs = monkey.rhs === "old" ? item : Number(monkey.rhs);
          let newValue =
            monkey.operand === Operand.add
              ? lhs + rhs
              : monkey.operand === Operand.multiply
              ? lhs * rhs
              : 0;

          newValue = newValue % reducer;

          // perform test
          const throwTarget =
            newValue % monkey.testDivisor === 0
              ? monkey.trueTarget
              : monkey.falseTarget;

          monkies[throwTarget].items.push(newValue);
        }
        monkey.items = [];
      }
    }
  }

  monkies.sort((a, b) => b.inspections - a.inspections);

  console.log(`Day 11b: ${monkies[0].inspections * monkies[1].inspections}`);
};

if (import.meta.main) {
  await day11a();
  await day11b();
}
