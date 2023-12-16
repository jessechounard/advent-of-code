import Foundation

private enum TileType: String {
    case Empty = "."
    case ForwardMirror = "/"
    case BackMirror = "\\"
    case VerticalSplitter = "|"
    case HorizontalSplitter = "-"
}

private enum Direction {
    case Up
    case Down
    case Left
    case Right
}

private struct Tile {
    var type: TileType
    var lit: Bool = false
    var directions: Set<Direction> = Set()
}

private struct Light {
    var direction: Direction
    var posX: Int
    var posY: Int
}

private func readInput() -> [[Tile]] {
    if let input = try? String(contentsOfFile: "input/day-16.txt") {
        return input.split(separator: "\n").map {
            $0.map {
                let type = switch $0 {
                case ".":
                    TileType.Empty
                case "/":
                    TileType.ForwardMirror
                case "\\":
                    TileType.BackMirror
                case "|":
                    TileType.VerticalSplitter
                default:
                    TileType.HorizontalSplitter
                }
                return Tile(type: type)
            }
        }
    }
    return []
}

private func printTiles(tiles: [[Tile]]) {
    for row in tiles { 
        for tile in row {
            print(tile.type.rawValue, terminator: "")
        }
        print("")
    }
}

private func lightTiles(_ inputTiles: [[Tile]], _ light: Light) -> Int {
    var tiles = inputTiles
    var lights: [Light] = [light]

    var lightIndex = 0
    while lightIndex < lights.count {
        if lights[lightIndex].direction == Direction.Right {
            lights[lightIndex].posX += 1
        } else if lights[lightIndex].direction == Direction.Left {
            lights[lightIndex].posX -= 1
        } else if lights[lightIndex].direction == Direction.Up {
            lights[lightIndex].posY -= 1
        } else if lights[lightIndex].direction == Direction.Down {
            lights[lightIndex].posY += 1
        }

        let light = lights[lightIndex]

        if light.posX >= tiles[0].count || light.posX < 0 || light.posY >= tiles
            .count || light.posY < 0 ||
            tiles[light.posY][light.posX].directions.contains(light.direction)
        {
            lightIndex += 1
            continue
        }

        tiles[light.posY][light.posX].directions.insert(light.direction)
        tiles[light.posY][light.posX].lit = true

        let tile = tiles[light.posY][light.posX]

        if tile.type == TileType.Empty {
            // do nothing
        } else if tile.type == TileType.ForwardMirror {
            lights[lightIndex].direction = switch light.direction {
            case Direction.Up:
                Direction.Right
            case Direction.Down:
                Direction.Left
            case Direction.Left:
                Direction.Down
            default:
                Direction.Up
            }
        } else if tile.type == TileType.BackMirror {
            lights[lightIndex].direction = switch light.direction {
            case Direction.Up:
                Direction.Left
            case Direction.Down:
                Direction.Right
            case Direction.Left:
                Direction.Up
            default:
                Direction.Down
            }
        } else if tile.type == TileType.VerticalSplitter {
            switch light.direction {
            case Direction.Left:
                fallthrough
            case Direction.Right:
                lights[lightIndex].direction = Direction.Up
                lights.append(Light(direction: Direction.Down, posX: light.posX, posY: light.posY))
            default:
                break
            }
        } else if tile.type == TileType.HorizontalSplitter {
            switch light.direction {
            case Direction.Up:
                fallthrough
            case Direction.Down:
                lights[lightIndex].direction = Direction.Left
                lights.append(Light(direction: Direction.Right, posX: light.posX, posY: light.posY))
            default:
                break
            }
        }
    }

    return tiles.reduce([], +).reduce(0) { $0 + ($1.lit ? 1 : 0) }
}

func day16a() {
    let tiles = readInput()
    print(lightTiles(tiles, Light(direction: Direction.Right, posX: -1, posY: 0)))
}

func day16b() {
    let tiles = readInput()
    var maximum = 0

    for row in (0 ..< tiles.count) {
        maximum = max(maximum, lightTiles(tiles, Light(direction: Direction.Right, posX: -1, posY: row)))
    }
    for column in (0 ..< tiles[0].count) {
        maximum = max(maximum, lightTiles(tiles, Light(direction: Direction.Right, posX: column, posY: -1)))
    }
    
    print(maximum)
}
