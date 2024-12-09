const std = @import("std");
const shared = @import("shared.zig");

// working in main.zig, then copying to dayXX.zig after finishing

pub fn main() !void {
    const print = std.debug.print;

    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    const lines = try shared.readLines(allocator, "../input/day02.txt");
    defer lines.deinit();

    var safe_reports: i32 = 0;

    for (lines.items) |line| {
        const levels = try getLevels(allocator, line);
        defer levels.deinit();

        if (try isSafe(levels, false)) {
            safe_reports += 1;
        }
    }

    print("safe reports: {}\n", .{safe_reports});

    safe_reports = 0;

    for (lines.items) |line| {
        const levels = try getLevels(allocator, line);
        defer levels.deinit();

        if (try isSafe(levels, true)) {
            safe_reports += 1;
        }
    }

    print("safe reports: {}\n", .{safe_reports});
}

fn getLevels(allocator: std.mem.Allocator, line: []u8) !std.ArrayList(i32) {
    var it = std.mem.splitSequence(u8, line, " ");
    var list = std.ArrayList(i32).init(allocator);

    while (it.next()) |num| {
        try list.append(try std.fmt.parseInt(i32, num, 10));
    }

    return list;
}

fn isSafe(levels: std.ArrayList(i32), allow_remove: bool) !bool {
    const direction = levels.items[0] - levels.items[1];

    for (0..(levels.items.len - 1)) |i| {
        const first_number = levels.items[i];
        const second_number = levels.items[i + 1];
        const difference = first_number - second_number;
        const magnitude = @abs(difference);

        if ((difference * direction) < 0 or magnitude < 1 or magnitude > 3) {
            if (allow_remove) {
                for (0..levels.items.len) |index| {
                    var clone = try levels.clone();
                    defer clone.deinit();

                    _ = clone.orderedRemove(index);
                    if (try isSafe(clone, false)) {
                        return true;
                    }
                }
            }

            return false;
        }
    }

    return true;
}
