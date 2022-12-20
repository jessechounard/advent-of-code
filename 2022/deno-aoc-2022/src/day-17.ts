const Direction = {
  Left: "Left",
  Right: "Right",
} as const;

type Direction = keyof typeof Direction;

const Block = {
  HorizontalBar: "HorizontalBar",
  Plus: "Plus",
  L: "L",
  VerticalBar: "VerticalBar",
  Square: "Square",
} as const;

type Block = keyof typeof Block;

const GridCell = {
  Empty: "Empty",
  Falling: "Falling",
  Fixed: "Fixed",
} as const;

type GridCell = keyof typeof GridCell;

type State = {
  blockIndex: number;
  jetIndex: number;
  rowData: number[];
};

function gridToRowData(grid: GridCell[][]): number[] {
  const result: number[] = [];

  for (let i = 0; i < 20; i++) {
    const row = grid[grid.length - 1 - i];
    let value = 0;

    for (const cell of row) {
      value <<= 1;
      value |= cell === GridCell.Fixed ? 1 : 0;
    }
    result.push(value);
  }

  return result;
}

const blockData = new Map<Block, GridCell[][]>();
blockData.set(Block.HorizontalBar, [
  ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Falling", "Falling", "Falling", "Falling", "Empty"],
]);
blockData.set(Block.Plus, [
  ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Empty", "Falling", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Falling", "Falling", "Falling", "Empty", "Empty"],
  ["Empty", "Empty", "Empty", "Falling", "Empty", "Empty", "Empty"],
]);
blockData.set(Block.L, [
  ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Falling", "Falling", "Falling", "Empty", "Empty"],
  ["Empty", "Empty", "Empty", "Empty", "Falling", "Empty", "Empty"],
  ["Empty", "Empty", "Empty", "Empty", "Falling", "Empty", "Empty"],
]);
blockData.set(Block.VerticalBar, [
  ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Falling", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Falling", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Falling", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Falling", "Empty", "Empty", "Empty", "Empty"],
]);
blockData.set(Block.Square, [
  ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Falling", "Falling", "Empty", "Empty", "Empty"],
  ["Empty", "Empty", "Falling", "Falling", "Empty", "Empty", "Empty"],
]);

const blockOrder = [
  Block.HorizontalBar,
  Block.Plus,
  Block.L,
  Block.VerticalBar,
  Block.Square,
];

function parseInput(input: string): Direction[] {
  return input
    .split("")
    .map((c) => (c === "<" ? Direction.Left : Direction.Right));
}

// function printGrid(grid: GridCell[][]): void {
//   console.log("");
//   for (let y = grid.length - 1; y >= 0; y--) {
//     const line = grid[y];
//     let lineString = "|";
//     for (const cell of line) {
//       lineString +=
//         cell === GridCell.Empty ? "." : cell === GridCell.Falling ? "@" : "#";
//     }
//     lineString += "|";
//     console.log(lineString);
//   }
//   console.log("+-------+");
// }

const day17a = async () => {
  const input = await Deno.readTextFile("input/day-17.txt");
  const directions = parseInput(input);
  const grid: GridCell[][] = [];

  let currentBlockShape = 0;
  let currentDirection = 0;
  let blockCount = 0;
  let highestBlockRow = -1;

  while (true) {
    // add a new block
    const blockToAdd = blockOrder[currentBlockShape];
    currentBlockShape = (currentBlockShape + 1) % blockOrder.length;
    blockCount++;

    const blockLines = blockData.get(blockToAdd)!;
    let bottomBlockRow = highestBlockRow === -1 ? 3 : highestBlockRow + 4;

    for (let i = 0; i < blockLines.length; i++) {
      const blockLine = blockLines[i];
      if (highestBlockRow === -1 || grid.length <= highestBlockRow + i + 1) {
        grid.push([...blockLine]);
      } else {
        grid[highestBlockRow + i + 1] = [...blockLine];
      }
    }

    let topBlockRow = bottomBlockRow + (blockLines.length - 4);

    while (true) {
      // move block sideways
      const directionToMove = directions[currentDirection];
      currentDirection = (currentDirection + 1) % directions.length;

      if (directionToMove === Direction.Left) {
        let moveBlocked = false;
        for (let y = bottomBlockRow; y <= topBlockRow; y++) {
          for (let x = 0; x < 7; x++) {
            if (grid[y][x] === GridCell.Falling) {
              if (x === 0 || grid[y][x - 1] === GridCell.Fixed) {
                moveBlocked = true;
                break;
              }
            }
          }
          if (moveBlocked) {
            break;
          }
        }
        if (!moveBlocked) {
          for (let y = bottomBlockRow; y <= topBlockRow; y++) {
            for (let x = 0; x < 7; x++) {
              if (grid[y][x] === GridCell.Falling) {
                grid[y][x] = GridCell.Empty;
                grid[y][x - 1] = GridCell.Falling;
              }
            }
          }
        }
      } else {
        {
          let moveBlocked = false;
          for (let y = bottomBlockRow; y <= topBlockRow; y++) {
            for (let x = 6; x >= 0; x--) {
              if (grid[y][x] === GridCell.Falling) {
                if (x === 6 || grid[y][x + 1] === GridCell.Fixed) {
                  moveBlocked = true;
                  break;
                }
              }
            }
            if (moveBlocked) {
              break;
            }
          }
          if (!moveBlocked) {
            for (let y = bottomBlockRow; y <= topBlockRow; y++) {
              for (let x = 6; x >= 0; x--) {
                if (grid[y][x] === GridCell.Falling) {
                  grid[y][x] = GridCell.Empty;
                  grid[y][x + 1] = GridCell.Falling;
                }
              }
            }
          }
        }
      }

      // drop one
      let dropBlocked = false;
      for (let y = bottomBlockRow; y <= topBlockRow; y++) {
        for (let x = 0; x < 7; x++) {
          if (grid[y][x] === GridCell.Falling) {
            if (y === 0 || grid[y - 1][x] === GridCell.Fixed) {
              dropBlocked = true;
              break;
            }
          }
        }
        if (dropBlocked) {
          break;
        }
      }
      if (!dropBlocked) {
        for (let y = bottomBlockRow; y <= topBlockRow; y++) {
          for (let x = 0; x < 7; x++) {
            if (grid[y][x] === GridCell.Falling) {
              grid[y][x] = GridCell.Empty;
              grid[y - 1][x] = GridCell.Falling;
            }
          }
        }
      } else {
        for (let y = bottomBlockRow; y <= topBlockRow; y++) {
          for (let x = 0; x < 7; x++) {
            if (grid[y][x] === GridCell.Falling) {
              grid[y][x] = GridCell.Fixed;
            }
          }
        }
      }

      bottomBlockRow--;
      topBlockRow--;

      // if can't drop, break
      if (dropBlocked) {
        break;
      }
    }

    let found = false;
    for (let y = grid.length - 1; y >= 0; y--) {
      for (const cell of grid[y]) {
        if (cell === GridCell.Fixed) {
          found = true;
          highestBlockRow = y;
          break;
        }
      }
      if (found) {
        break;
      }
    }

    if (blockCount === 2022) {
      break;
    }
  }

  console.log(`Day 17a ${highestBlockRow + 1}`);
};

const day17b = async () => {
  const input = await Deno.readTextFile("input/day-17.txt");
  const directions = parseInput(input);
  const grid: GridCell[][] = [];
  const states = new Map<
    string,
    { blockCount: number; highestBlockRow: number }
  >();

  let currentBlockShape = 0;
  let currentDirection = 0;
  let blockCount = 0;
  let highestBlockRow = -1;
  let exitBlock = -1;
  let exitOffset = 0;

  while (true) {
    // add a new block
    const blockToAdd = blockOrder[currentBlockShape];
    currentBlockShape = (currentBlockShape + 1) % blockOrder.length;
    blockCount++;

    const blockLines = blockData.get(blockToAdd)!;
    let bottomBlockRow = highestBlockRow === -1 ? 3 : highestBlockRow + 4;

    for (let i = 0; i < blockLines.length; i++) {
      const blockLine = blockLines[i];
      if (highestBlockRow === -1 || grid.length <= highestBlockRow + i + 1) {
        grid.push([...blockLine]);
      } else {
        grid[highestBlockRow + i + 1] = [...blockLine];
      }
    }

    let topBlockRow = bottomBlockRow + (blockLines.length - 4);

    while (true) {
      // move block sideways
      const directionToMove = directions[currentDirection];
      currentDirection = (currentDirection + 1) % directions.length;

      if (directionToMove === Direction.Left) {
        let moveBlocked = false;
        for (let y = bottomBlockRow; y <= topBlockRow; y++) {
          for (let x = 0; x < 7; x++) {
            if (grid[y][x] === GridCell.Falling) {
              if (x === 0 || grid[y][x - 1] === GridCell.Fixed) {
                moveBlocked = true;
                break;
              }
            }
          }
          if (moveBlocked) {
            break;
          }
        }
        if (!moveBlocked) {
          for (let y = bottomBlockRow; y <= topBlockRow; y++) {
            for (let x = 0; x < 7; x++) {
              if (grid[y][x] === GridCell.Falling) {
                grid[y][x] = GridCell.Empty;
                grid[y][x - 1] = GridCell.Falling;
              }
            }
          }
        }
      } else {
        {
          let moveBlocked = false;
          for (let y = bottomBlockRow; y <= topBlockRow; y++) {
            for (let x = 6; x >= 0; x--) {
              if (grid[y][x] === GridCell.Falling) {
                if (x === 6 || grid[y][x + 1] === GridCell.Fixed) {
                  moveBlocked = true;
                  break;
                }
              }
            }
            if (moveBlocked) {
              break;
            }
          }
          if (!moveBlocked) {
            for (let y = bottomBlockRow; y <= topBlockRow; y++) {
              for (let x = 6; x >= 0; x--) {
                if (grid[y][x] === GridCell.Falling) {
                  grid[y][x] = GridCell.Empty;
                  grid[y][x + 1] = GridCell.Falling;
                }
              }
            }
          }
        }
      }

      // drop one
      let dropBlocked = false;
      for (let y = bottomBlockRow; y <= topBlockRow; y++) {
        for (let x = 0; x < 7; x++) {
          if (grid[y][x] === GridCell.Falling) {
            if (y === 0 || grid[y - 1][x] === GridCell.Fixed) {
              dropBlocked = true;
              break;
            }
          }
        }
        if (dropBlocked) {
          break;
        }
      }
      if (!dropBlocked) {
        for (let y = bottomBlockRow; y <= topBlockRow; y++) {
          for (let x = 0; x < 7; x++) {
            if (grid[y][x] === GridCell.Falling) {
              grid[y][x] = GridCell.Empty;
              grid[y - 1][x] = GridCell.Falling;
            }
          }
        }
      } else {
        for (let y = bottomBlockRow; y <= topBlockRow; y++) {
          for (let x = 0; x < 7; x++) {
            if (grid[y][x] === GridCell.Falling) {
              grid[y][x] = GridCell.Fixed;
            }
          }
        }
      }

      bottomBlockRow--;
      topBlockRow--;

      // if can't drop, break
      if (dropBlocked) {
        break;
      }
    }

    let found = false;
    for (let y = grid.length - 1; y >= 0; y--) {
      for (const cell of grid[y]) {
        if (cell === GridCell.Fixed) {
          found = true;
          highestBlockRow = y;
          break;
        }
      }
      if (found) {
        break;
      }
    }

    if (exitBlock === -1 && grid.length > 20) {
      const state: State = {
        blockIndex: currentBlockShape,
        jetIndex: currentDirection,
        rowData: gridToRowData(grid),
      };

      const stateString = JSON.stringify(state);
      if (states.has(stateString)) {
        const state = states.get(stateString)!;

        const blocksRemaining = 1000000000000 - blockCount;
        const groupSize = blockCount - state.blockCount;
        const groups = Math.floor(blocksRemaining / groupSize);
        const groupRemainder = blocksRemaining % groupSize;

        exitOffset = groups * (highestBlockRow - state.highestBlockRow);
        exitBlock = blockCount + groupRemainder;
      } else {
        states.set(stateString, { blockCount, highestBlockRow });
      }
    } else if (exitBlock !== -1 && blockCount === exitBlock) {
      break;
    }
  }

  console.log(`Day 17b ${highestBlockRow + 1 + exitOffset}`);
};

if (import.meta.main) {
  await day17a();
  await day17b();
}
