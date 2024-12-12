const std = @import("std");
const shared = @import("shared.zig");

// working in main.zig, then copying to dayXX.zig after finishing

pub fn main() !void {
    const print = std.debug.print;

    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    const lines = try shared.readLines(allocator, "../input/day05.txt");
    defer lines.deinit();

    var sum: u64 = 0;
    var corrected_sum: u64 = 0;

    var state: u8 = 0;

    var rules = [_]std.ArrayList(u8){std.ArrayList(u8).init(allocator)} ** 100;
    defer {
        for (rules) |rule| {
            rule.deinit();
        }
    }

    for (lines.items) |line| {
        if (state == 0) {
            if (line.len == 0) {
                state = 1;
            } else {
                var ruleIterator = std.mem.splitScalar(u8, line, '|');
                const page = try std.fmt.parseInt(u8, ruleIterator.next().?, 10);
                const key = try std.fmt.parseInt(u8, ruleIterator.next().?, 10);

                try rules[key].append(page);
            }
        } else {
            var failed: bool = false;

            var pages = std.ArrayList(u8).init(allocator);
            defer pages.deinit();

            var pagesIterator = std.mem.splitScalar(u8, line, ',');
            while (pagesIterator.next()) |pageString| {
                const page = try std.fmt.parseInt(u8, pageString, 10);

                const pageRules = rules[page];

                for (pages.items) |p| {
                    const needle = [1]u8{p};
                    if (!failed and std.mem.indexOf(u8, pageRules.items, &needle) == null) {
                        failed = true;
                        break;
                    }
                }

                try pages.append(page);
            }

            if (!failed) {
                const middle = pages.items[pages.items.len / 2];
                sum += middle;
            } else {
                const fixed_pages = try pages.clone();
                defer fixed_pages.deinit();

                for (1..(fixed_pages.items.len - 1)) |i| {
                    for (0..(fixed_pages.items.len - i)) |index| {
                        // behold the bubble sort!

                        const a = fixed_pages.items[index];
                        const a_rules = rules[a].items;
                        const a_needle = [1]u8{a};

                        const b = fixed_pages.items[index + 1];
                        const b_rules = rules[b].items;
                        const b_needle = [1]u8{b};

                        const a_contains = (std.mem.indexOf(u8, a_rules, &b_needle) != null);
                        const b_contains = (std.mem.indexOf(u8, b_rules, &a_needle) != null);

                        if (a_contains or !b_contains) {
                            std.mem.swap(u8, &fixed_pages.items[index], &fixed_pages.items[index + 1]);
                        }
                    }
                }
                const middle = fixed_pages.items[fixed_pages.items.len / 2];
                corrected_sum += middle;
            }
        }
    }

    print("result: {}\n", .{sum});
    print("corrected result: {}\n", .{corrected_sum});
}
