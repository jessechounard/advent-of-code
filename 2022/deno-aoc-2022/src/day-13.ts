type Packet = [number] | Packet[];

function isPacket(input: number | Packet): input is Packet {
  return Array.isArray(input);
}

enum PacketComparison {
  Less = -1,
  Same = 0,
  Greater = 1,
}

function comparePackets(lhs: Packet, rhs: Packet): PacketComparison {
  let index = 0;

  while (true) {
    const leftEnd = index >= lhs.length;
    const rightEnd = index >= rhs.length;

    if (leftEnd && rightEnd) {
      return PacketComparison.Same;
    } else if (leftEnd) {
      return PacketComparison.Less;
    } else if (rightEnd) {
      return PacketComparison.Greater;
    }

    const leftCurrent = lhs[index];
    const rightCurrent = rhs[index];

    let result = PacketComparison.Same;

    if (isPacket(leftCurrent) && isPacket(rightCurrent)) {
      result = comparePackets(leftCurrent, rightCurrent);
    } else if (isPacket(leftCurrent) && !isPacket(rightCurrent)) {
      result = comparePackets(leftCurrent, [rightCurrent]);
    } else if (!isPacket(leftCurrent) && isPacket(rightCurrent)) {
      result = comparePackets([leftCurrent], rightCurrent);
    } else if (!isPacket(leftCurrent) && !isPacket(rightCurrent)) {
      if (leftCurrent < rightCurrent) {
        result = PacketComparison.Less;
      } else if (leftCurrent > rightCurrent) {
        result = PacketComparison.Greater;
      }
    }

    if (result != PacketComparison.Same) {
      return result;
    }
    index++;
  }
}

const day13a = async () => {
  const inputFile = await Deno.readTextFile("input/day-13.txt");
  const lines = inputFile.split("\n");

  let indexSum = 0;

  for (let i = 0; i < lines.length; i += 3) {
    const leftPacket = JSON.parse(lines[i]) as Packet;
    const rightPacket = JSON.parse(lines[i + 1]) as Packet;

    if (comparePackets(leftPacket, rightPacket) == PacketComparison.Less) {
      indexSum += i / 3 + 1;
    }
  }

  console.log(`Day 13a: ${indexSum}`);
};

const day13b = async () => {
  const inputFile =
    (await Deno.readTextFile("input/day-13.txt")) + "\n[[2]]\n[[6]]";
  const lines = inputFile.split("\n");
  const packets = lines
    .filter((line) => line !== "")
    .map((line) => JSON.parse(line) as Packet);

  packets.sort((a, b) => comparePackets(a, b) as number);
  const searchPackets = packets.map((packet) => JSON.stringify(packet));

  const twoKey = searchPackets.findIndex((packet) => packet === "[[2]]");
  const sixKey = searchPackets.findIndex((packet) => packet === "[[6]]");

  if (twoKey && sixKey) {
    console.log(`Day 13b: ${(twoKey + 1) * (sixKey + 1)}`);
  } else {
    console.log(`Day 13a: YOU HAVE FAILED!`);
  }
};

if (import.meta.main) {
  await day13a();
  await day13b();
}
