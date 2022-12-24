const Operation = {
  Add: "+",
  Subtract: "-",
  Multiply: "*",
  Divide: "/",
} as const;

type Operation = typeof Operation[keyof typeof Operation];
type OperationFunction = (lhs: bigint, rhs: bigint) => bigint;

const Add = (lhs: bigint, rhs: bigint): bigint => {
  return lhs + rhs;
};

const Subtract = (lhs: bigint, rhs: bigint): bigint => {
  return lhs - rhs;
};

const Multiply = (lhs: bigint, rhs: bigint): bigint => {
  return lhs * rhs;
};

const Divide = (lhs: bigint, rhs: bigint): bigint => {
  return lhs / rhs;
};

type SolveFunction = (result: bigint, value: bigint) => bigint;

const SolveAdd = (result: bigint, known: bigint): bigint => {
  return result - known;
};

const SolveSubtractLHS = (result: bigint, rhs: bigint): bigint => {
  return result + rhs;
};

const SolveSubtractRHS = (result: bigint, lhs: bigint): bigint => {
  return lhs - result;
};

const SolveMultiply = (result: bigint, known: bigint): bigint => {
  return result / known;
};

const SolveDivideLHS = (result: bigint, rhs: bigint): bigint => {
  return result * rhs;
};

const SolveDivideRHS = (result: bigint, lhs: bigint): bigint => {
  return lhs / result;
};

const operations = new Map<Operation, OperationFunction>([
  ["+", Add],
  ["-", Subtract],
  ["*", Multiply],
  ["/", Divide],
]);

const leftSolvers = new Map<Operation, SolveFunction>([
  ["+", SolveAdd],
  ["-", SolveSubtractLHS],
  ["*", SolveMultiply],
  ["/", SolveDivideLHS],
]);

const rightSolvers = new Map<Operation, SolveFunction>([
  ["+", SolveAdd],
  ["-", SolveSubtractRHS],
  ["*", SolveMultiply],
  ["/", SolveDivideRHS],
]);

type Value = {
  kind: "Value";
  value: bigint;
};

type Equation = {
  kind: "Equation";
  lhs: string;
  rhs: string;
  operation: Operation;
};

type Entry = Value | Equation;

function parseInput(input: string): Map<string, Entry> {
  const result = new Map<string, Entry>();

  const lines = input.split("\n");
  for (const line of lines) {
    const segments = line.split(" ");
    const name = segments[0].split(":")[0];
    if (segments.length <= 2) {
      result.set(name, {
        kind: "Value",
        value: BigInt(segments[1]),
      });
    } else {
      result.set(name, {
        kind: "Equation",
        lhs: segments[1],
        rhs: segments[3],
        operation: segments[2] as Operation,
      });
    }
  }

  return result;
}

function resolve(name: string, data: Map<string, Entry>): bigint {
  const current = data.get(name);

  if (!current) {
    return 0n;
  } else if (current.kind === "Value") {
    return current.value;
  } else {
    const lhs = resolve(current.lhs, data);
    const rhs = resolve(current.rhs, data);
    return operations.get(current.operation)!(lhs, rhs);
  }
}

function solveFor(
  name: string,
  data: Map<string, Entry>,
  value: bigint,
  variable: string
): bigint {
  if (name === variable) {
    data.set(name, { kind: "Value", value });
    return value;
  }
  const current = data.get(name)! as Equation;
  const lhs = data.get(current.lhs)!;
  const rhs = data.get(current.rhs)!;
  let result = 0n;

  if (lhs.kind === "Value" && current.lhs !== variable) {
    const solved = rightSolvers.get(current.operation)!(value, lhs.value);
    result = solveFor(current.rhs, data, solved, variable);
  } else {
    const solved = leftSolvers.get(current.operation)!(
      value,
      (rhs as Value).value
    );
    result = solveFor(current.lhs, data, solved, variable);
  }

  data.set(name, { kind: "Value", value });
  return result;
}

function tryResolve(
  name: string,
  data: Map<string, Entry>,
  failName: string
): bigint {
  if (name === failName) {
    throw "Failed";
  }

  const current = data.get(name);

  if (!current) {
    return 0n;
  } else if (current.kind === "Value") {
    return current.value;
  } else {
    let failed = false;
    let lhs = 0n;
    let rhs = 0n;
    try {
      lhs = tryResolve(current.lhs, data, failName);
    } catch {
      failed = true;
    }
    try {
      rhs = tryResolve(current.rhs, data, failName);
    } catch {
      failed = true;
    }

    if (failed) {
      throw "Failed";
    }

    const result = operations.get(current.operation)!(lhs, rhs);
    data.set(name, {
      kind: "Value",
      value: result,
    });
    return result;
  }
}

const day21a = async () => {
  const input = await Deno.readTextFile("input/day-21.txt");
  const data = parseInput(input);

  const result = resolve("root", data);

  console.log(`Day 21a ${result}`);
};

const day21b = async () => {
  const input = await Deno.readTextFile("input/day-21.txt");
  const data = parseInput(input);
  let result = 0n;

  try {
    tryResolve("root", data, "humn");
  } catch {
    // Slight screwy use of try/catch as flow control
  }

  const root = data.get("root")! as Equation;
  const lhs = data.get(root.lhs)!;
  const rhs = data.get(root.rhs)!;
  if (lhs.kind === "Value") {
    result = solveFor(root.rhs, data, lhs.value, "humn");
  } else if (rhs.kind === "Value") {
    result = solveFor(root.lhs, data, rhs.value, "humn");
  }

  console.log(`Day 21b ${result}`);
};

if (import.meta.main) {
  await day21a();
  await day21b();
}
