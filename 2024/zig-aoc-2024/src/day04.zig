const std = @import("std");
const shared = @import("shared.zig");

// working in main.zig, then copying to dayXX.zig after finishing

pub fn main() !void {
    const print = std.debug.print;

    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    const lines = try shared.readLines(allocator, "../input/day04.txt");
    defer lines.deinit();

    var xmas_count: u32 = 0;

    for (0..lines.items.len) |y| {
        for (0..lines.items[y].len) |x| {
            const ix = @as(i32, @intCast(x));
            const iy = @as(i32, @intCast(y));

            xmas_count += if (findString("XMAS", lines, ix, iy, 0, -1)) 1 else 0;
            xmas_count += if (findString("XMAS", lines, ix, iy, 0, 1)) 1 else 0;
            xmas_count += if (findString("XMAS", lines, ix, iy, -1, 0)) 1 else 0;
            xmas_count += if (findString("XMAS", lines, ix, iy, 1, 0)) 1 else 0;
            xmas_count += if (findString("XMAS", lines, ix, iy, 1, -1)) 1 else 0;
            xmas_count += if (findString("XMAS", lines, ix, iy, 1, 1)) 1 else 0;
            xmas_count += if (findString("XMAS", lines, ix, iy, -1, 1)) 1 else 0;
            xmas_count += if (findString("XMAS", lines, ix, iy, -1, -1)) 1 else 0;
        }
    }

    print("xmas count: {}\n", .{xmas_count});

    var cross_mas_count: u32 = 0;

    for (0..lines.items.len) |y| {
        for (0..lines.items[y].len) |x| {
            const ix = @as(i32, @intCast(x));
            const iy = @as(i32, @intCast(y));

            const sam_df = findString("SAM", lines, ix, iy, 1, 1);
            const mas_df = findString("MAS", lines, ix, iy, 1, 1);
            const sam_db = findString("SAM", lines, ix + 2, iy, -1, 1);
            const mas_db = findString("MAS", lines, ix + 2, iy, -1, 1);

            cross_mas_count += if ((sam_df or mas_df) and (sam_db or mas_db)) 1 else 0;
        }
    }

    print("cross mas count: {}\n", .{cross_mas_count});
}

fn findString(string: []const u8, letter_grid: std.ArrayList([]u8), x: i32, y: i32, x_move: i32, y_move: i32) bool {
    if (string.len == 0) {
        return true;
    }

    if (y < 0 or y >= letter_grid.items.len) {
        return false;
    }

    const uy = @as(usize, @intCast(y));

    if (x < 0 or x >= letter_grid.items[uy].len) {
        return false;
    }

    const ux = @as(usize, @intCast(x));

    if (letter_grid.items[uy][ux] == string[0]) {
        return findString(string[1..], letter_grid, x + x_move, y + y_move, x_move, y_move);
    }

    return false;
}
