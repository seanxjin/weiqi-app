import { expect, test } from "@playwright/test";
import type { Move } from "../../src/game/online/protocol";
import { planSync } from "../../src/game/online/syncPlan";

const play = (color: "Black" | "White", x: number, y: number): Move => ({ type: "play", color, point: { x, y } });
const pass = (color: "Black" | "White"): Move => ({ type: "pass", color });

const b1 = play("Black", 2, 2);
const w1 = play("White", 6, 6);
const b2 = pass("Black");

test("identical histories need nothing (our own move acknowledged)", () => {
	expect(planSync([b1, w1], [b1, w1])).toEqual({ kind: "same" });
	expect(planSync([], [])).toEqual({ kind: "same" });
});

test("a missing tail is appended (opponent moves)", () => {
	expect(planSync([b1], [b1, w1, b2])).toEqual({ kind: "append", from: 1 });
	expect(planSync([], [b1])).toEqual({ kind: "append", from: 0 });
});

test("diverging or longer local histories are rebuilt from the server", () => {
	expect(planSync([b1, w1], [b1])).toEqual({ kind: "rebuild" });
	expect(planSync([b1, play("White", 5, 5)], [b1, w1])).toEqual({ kind: "rebuild" });
	expect(planSync([b1, pass("White")], [b1, w1])).toEqual({ kind: "rebuild" });
});
