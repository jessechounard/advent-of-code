const std = @import("std");

pub fn readLines(allocator: std.mem.Allocator, path: []const u8) !std.ArrayList([]u8) {
    var file = try std.fs.cwd().openFile(path, .{});
    defer file.close();

    const buffer = try file.readToEndAlloc(allocator, (try file.stat()).size);
    defer allocator.free(buffer);

    var lines = std.ArrayList([]u8).init(allocator);
    var it = std.mem.splitScalar(u8, std.mem.trim(u8, buffer, "\n"), '\n');
    while (it.next()) |line| {
        const trimmed = std.mem.trim(u8, line, "\r");
        const buff: []u8 = try allocator.alloc(u8, trimmed.len);
        @memcpy(buff, trimmed);
        try lines.append(buff);
    }
    return lines;
}

pub fn readFile(allocator: std.mem.Allocator, path: []const u8) ![]u8 {
    var file = try std.fs.cwd().openFile(path, .{});
    defer file.close();

    const buffer = try file.readToEndAlloc(allocator, (try file.stat()).size);
    return buffer;
}

pub fn sliceEquality(comptime T: type, a: []const T, b: []const T) bool {
    if (a.ptr == b.ptr) {
        return true;
    }
    if (a.len != b.len) {
        return false;
    }
    for (a, b) |a_item, b_item| {
        if (a_item != b_item) {
            return false;
        }
    }
    return true;
}
