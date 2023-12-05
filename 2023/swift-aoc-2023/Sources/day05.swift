import Foundation
import Parsing

struct Range {
    var start, length: Int
}

struct Transformation {
    var destination: Int
    var source: Int
    var length: Int
}

func parseInputA(lines: String) -> ([Int], [[(Int, Int, Int)]])? {
    let parser = Parse {
        "seeds:"
        Many {
            Whitespace()
            Int.parser()
        }
        Many {
            Whitespace()
            OneOf {
                "seed-to-soil map:\n"
                "soil-to-fertilizer map:\n"
                "fertilizer-to-water map:\n"
                "water-to-light map:\n"
                "light-to-temperature map:\n"
                "temperature-to-humidity map:\n"
                "humidity-to-location map:\n"
            }
            Many {
                Int.parser()
                Whitespace()
                Int.parser()
                Whitespace()
                Int.parser()
                Whitespace()
            }
        }
    }

    return try? parser.parse(lines)
}

func parseInputB(input: String) -> ([Range], [[Transformation]])? {
    let range = Parse(input: Substring.self) {
        Digits()
        Whitespace()
        Digits()
    }.map { Range(start: $0, length: $1) }

    let transformation = Parse(input: Substring.self) {
        Digits()
        Whitespace()
        Digits()
        Whitespace()
        Digits()
    }.map { Transformation(destination: $0, source: $1, length: $2) }

    let parser = Parse(input: Substring.self) {
        "seeds:"
        Many {
            Whitespace()
            range
        }
        Many {
            Whitespace()
            OneOf {
                "seed-to-soil map:\n"
                "soil-to-fertilizer map:\n"
                "fertilizer-to-water map:\n"
                "water-to-light map:\n"
                "light-to-temperature map:\n"
                "temperature-to-humidity map:\n"
                "humidity-to-location map:\n"
            }
            Many {
                transformation
                Whitespace()
            }
        }
    }

    return try? parser.parse(input)
}

func day05a() {
    if let contents = try? String(contentsOfFile: "input/day-05.txt") {
        if let input = parseInputA(lines: contents) {
            let locations = input.0.map {
                var current = $0

                for method in input.1 {
                    if let converter = method.first(where: {
                        current >= $0.1 && current < $0.1 + $0.2
                    }) {
                        current = converter.0 + (current - converter.1)
                        continue
                    }
                }

                return current
            }

            print(locations.reduce(Int.max) {
                $0 < $1 ? $0 : $1
            })
        }
    }
}

func day05b() {
    if let contents = try? String(contentsOfFile: "input/day-05.txt") {
        if let (initialRanges, transformations) = parseInputB(input: contents) {
            var ranges: [Range] = []
            var nextRanges = initialRanges

            for transformation in transformations {
                ranges = nextRanges
                nextRanges = []

                var index = 0
                while index < ranges.count {
                    var range = ranges[index]

                    for conversion in transformation {
                        let rs = range.start
                        let re = rs + range.length - 1
                        let cs = conversion.source
                        let ce = cs + conversion.length - 1
                        let offset = conversion.destination - conversion.source

                        // five possibilites
                        // 1) range fully contained in conversion
                        // 2) conversion fully contained in range (splitting range)
                        // 3) range overlaps beginning of conversion
                        // 4) range overlaps end of conversion
                        // 5) no overlap at all (no transformation)

                        if rs >= cs, re <= ce {
                            nextRanges.append(Range(start: rs + offset, length: range.length))
                            range.length = 0
                            break
                        }
                        if rs < cs, re > ce {
                            nextRanges.append(Range(start: cs + offset, length: conversion.length))
                            ranges.append(Range(start: ce + 1, length: re - ce + 1))
                            range.length = cs - rs + 1
                            continue
                        }
                        if rs < cs, re >= cs {
                            nextRanges.append(Range(start: cs + offset, length: re - cs + 1))
                            range.length -= re - cs + 1
                            continue
                        }
                        if rs <= ce, re > ce {
                            nextRanges.append(Range(start: rs + offset, length: ce - rs + 1))
                            range.start += ce - rs + 1
                            range.length -= ce - rs + 1
                            continue
                        }
                    }

                    if range.length > 0 {
                        nextRanges.append(range)
                    }

                    index += 1
                }
            }

            let minimum = nextRanges.reduce(Int.max) { $0 < $1.start ? $0 : $1.start }
            print(minimum)
        }
    }
}
