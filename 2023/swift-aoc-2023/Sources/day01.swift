import Foundation

func day01a() {
    let path = "input/day-01.txt"
    var contents = ""

    do {
        contents = try String(contentsOfFile: path)
    }
    catch let error as NSError {
        print("Error reading file: \(error)")
    }

    let lines = contents.components(separatedBy: "\n")
    var sum = 0

    for line in lines {
        let first = (line.first(where: {$0.isNumber})?.wholeNumberValue)!
        let last = (line.last(where: {$0.isNumber})?.wholeNumberValue)!
        sum += first * 10 + last
    }


    print(sum)
}

func day01b() {
    let path = "input/day-01.txt"
    var contents = ""

    do {
        contents = try String(contentsOfFile: path)
    }
    catch let error as NSError {
        print("Error reading file: \(error)")
    }

    let lines = contents.components(separatedBy: "\n")
    var sum = 0

    for var line in lines {
        line = line.replacingOccurrences(of: "one", with: "o1e")
        line = line.replacingOccurrences(of: "two", with: "t2o")
        line = line.replacingOccurrences(of: "three", with: "t3e")
        line = line.replacingOccurrences(of: "four", with: "f4r")
        line = line.replacingOccurrences(of: "five", with: "f5e")
        line = line.replacingOccurrences(of: "six", with: "s6x")
        line = line.replacingOccurrences(of: "seven", with: "s7n")
        line = line.replacingOccurrences(of: "eight", with: "e8t")
        line = line.replacingOccurrences(of: "nine", with: "n9e")

        let first = (line.first(where: {$0.isNumber})?.wholeNumberValue)!
        let last = (line.last(where: {$0.isNumber})?.wholeNumberValue)!
        sum += first * 10 + last
    }


    print(sum)
}
