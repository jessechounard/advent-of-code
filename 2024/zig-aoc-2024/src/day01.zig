const std = @import("std");
const shared = @import("shared.zig");

// working in main.zig, then copying to dayXX.zig after finishing

pub fn main() !void {
    const print = std.debug.print;

    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    const lines = try shared.readLines(allocator, "../input/day01.txt");
    defer lines.deinit();

    const group_a: []u64 = try allocator.alloc(u64, lines.items.len);
    const group_b: []u64 = try allocator.alloc(u64, lines.items.len);

    for (lines.items, 0..) |line, i| {
        var number_iterator = std.mem.splitSequence(u8, line, "   ");

        group_a[i] = try std.fmt.parseInt(u64, number_iterator.next().?, 10);
        group_b[i] = try std.fmt.parseInt(u64, number_iterator.next().?, 10);
    }

    std.mem.sort(u64, group_a, {}, comptime std.sort.asc(u64));
    std.mem.sort(u64, group_b, {}, comptime std.sort.asc(u64));

    var sum: u64 = 0;
    for (group_a, group_b) |a, b| {
        sum += if (a > b) a - b else b - a;
    }

    print("{}\n", .{sum});

    sum = 0;
    for (group_a) |a| {
        const needle = [1]u64{a};
        const count = std.mem.count(u64, group_b, &needle);

        sum += count * a;
    }

    print("{}\n", .{sum});
}
