type Directory = {
  name: string;
  parent: Directory | null;
  directories: Directory[];
  files: File[];
};

type File = {
  name: string;
  size: number;
};

function parseFileSystem(inputFile: string): Directory {
  const lines = inputFile.split("\n", -1);

  const fileSystem: Directory = {
    name: "/",
    parent: null,
    directories: [],
    files: [],
  };

  let current = fileSystem;

  for (const line of lines) {
    const segments = line.split(" ", -1);

    if (segments[0] === "$") {
      if (segments[1] === "cd") {
        if (segments[2] === "/") {
          current = fileSystem;
        } else if (segments[2] === "..") {
          if (current.parent) {
            current = current.parent;
          } else {
            console.log(
              `Error: current directory ${current.name} doesn't have a parent.`
            );
          }
        } else {
          const found = current.directories.find((x) => x.name === segments[2]);
          if (found) {
            current = found;
          } else {
            console.log(`Error: Directory ${segments[2]} was not found.`);
          }
        }
      } else if (segments[1] === "ls") {
        // Don't do anything, we'll catch the info in the else below
      }
    } else {
      if (segments[0] === "dir") {
        current.directories.push({
          name: segments[1],
          parent: current,
          files: [],
          directories: [],
        });
      } else {
        current.files.push({
          name: segments[1],
          size: Number(segments[0]),
        });
      }
    }
  }

  return fileSystem;
}

function getDirectorySize(directory: Directory, sizes: File[]): number {
  let totalSize = 0;

  for (const file of directory.files) {
    totalSize += file.size;
  }

  for (const subdirectory of directory.directories) {
    totalSize += getDirectorySize(subdirectory, sizes);
  }

  sizes.push({
    name: directory.name,
    size: totalSize,
  });

  return totalSize;
}

const day07a = async () => {
  const inputFile = await Deno.readTextFile("input/day-07.txt");
  const fileSystem = parseFileSystem(inputFile);
  const sizes: File[] = [];
  getDirectorySize(fileSystem, sizes);

  sizes.sort((a, b) => a.size - b.size);

  let totalSize = 0;

  for (const s of sizes) {
    if (s.size <= 100000) {
      totalSize += s.size;
    } else {
      break;
    }
  }

  console.log(`Day 7a: ${totalSize}`);
};

const day07b = async () => {
  const inputFile = await Deno.readTextFile("input/day-07.txt");
  const fileSystem = parseFileSystem(inputFile);
  const sizes: File[] = [];
  const directoryTotal = getDirectorySize(fileSystem, sizes);
  const spaceNeeded = 30000000 - (70000000 - directoryTotal);

  sizes.sort((a, b) => a.size - b.size);

  for (const s of sizes) {
    if (s.size >= spaceNeeded) {
      console.log(`Day 7b: ${s.size}`);
      break;
    }
  }
};

if (import.meta.main) {
  await day07a();
  await day07b();
}
