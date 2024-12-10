const std = @import("std");
const shared = @import("shared.zig");

// working in main.zig, then copying to dayXX.zig after finishing

const ParseError = error{
    UnknownState,
};

pub fn main() !void {
    const print = std.debug.print;

    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    const buffer = try shared.readFile(allocator, "../input/day03.txt");
    defer allocator.free(buffer);

    print("Total: {}\n", .{try getTotal(allocator, buffer)});

    // for part 2:
    //     split on dont()
    //     first group is included (add to do_groups)
    //     foreach remaining group
    //         split on do()
    //         first group is ignored
    //         rest are included (add to do_groups)
    //     join do_groups
    //     run getTotal on that new buffer

    var do_groups = std.ArrayList([]const u8).init(allocator);
    defer do_groups.deinit();
    var dont_split = std.mem.splitSequence(u8, buffer, "don't()");
    const first = dont_split.next();
    try do_groups.append(first.?);

    while (dont_split.next()) |split| {
        var do_split = std.mem.splitSequence(u8, split, "do()");
        _ = do_split.next();
        while (do_split.next()) |good| {
            try do_groups.append(good);
        }
    }

    const split_buffer = try joinStrings(allocator, do_groups);
    defer allocator.free(split_buffer);

    print("Total: {}\n", .{try getTotal(allocator, split_buffer)});
}

fn getTotal(allocator: std.mem.Allocator, buffer: []u8) !i64 {
    var total: i64 = 0;
    var state: i8 = 0;
    // states:
    // 0: m
    // 1: u
    // 2: l
    // 3: (
    // 4: 1 to 3 numbers or ,
    // 5: 1 to 3 numbers or )
    var counter: usize = 0;
    var numberA = std.ArrayList(u8).init(allocator);
    defer numberA.deinit();
    var numberB = std.ArrayList(u8).init(allocator);
    defer numberB.deinit();

    for (buffer) |c| {
        state = switch (state) {
            0 => if (c == 'm') 1 else 0,
            1 => if (c == 'u') 2 else 0,
            2 => if (c == 'l') 3 else 0,
            3 => blk: {
                counter = 0;
                numberA.clearAndFree();
                break :blk if (c == '(') 4 else 0;
            },
            4 => blk: {
                if (c == ',') {
                    counter = 0;
                    numberB.clearAndFree();
                    break :blk 5;
                } else if (isNumber(c) and counter < 3) {
                    try numberA.append(c);
                    counter += 1;
                    break :blk 4;
                } else {
                    break :blk 0;
                }
            },
            5 => blk: {
                if (c == ')') {
                    counter = 0;
                    const a = try std.fmt.parseInt(i32, numberA.items, 10);
                    const b = try std.fmt.parseInt(i32, numberB.items, 10);
                    total += a * b;
                    break :blk 0;
                } else if (isNumber(c) and counter < 3) {
                    try numberB.append(c);
                    counter += 1;
                    break :blk 5;
                } else {
                    break :blk 0;
                }
            },
            else => return error.UnknownState,
        };
    }

    return total;
}

fn isNumber(c: u8) bool {
    return c >= '0' and c <= '9';
}

fn joinStrings(allocator: std.mem.Allocator, strings: std.ArrayList([]const u8)) ![]u8 {
    var length: usize = 0;

    for (strings.items) |s| {
        length += s.len;
    }

    var buffer = try allocator.alloc(u8, length);

    var position: usize = 0;

    for (strings.items) |s| {
        std.mem.copyForwards(u8, buffer[position..], s);
        position += s.len;
    }

    return buffer;
}
