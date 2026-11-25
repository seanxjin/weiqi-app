import { expect, test } from "@playwright/test";
import { parseServerMessage } from "../../src/api/protocol";

const game = {
	id: "g1",
	revision: 3,
	createdAt: 0,
	updatedAt: 0,
	config: {
		boardSize: 9,
		rules: { superko: "Positional", suicide: "Forbidden", passEnding: "TwoConsecutivePasses" },
		komi: 6.5,
		startingPlayer: "Black",
		setup: { kind: "empty" },
	},
	seats: { Black: { claimed: true }, White: { claimed: true } },
	phase: { kind: "playing" },
	position: {},
	captures: {},
	moves: [
		{ moveNumber: 1, move: { type: "play", color: "Black", point: { x: 2, y: 2 } }, capturedStones: [] },
		{ moveNumber: 2, move: { type: "pass", color: "White" }, capturedStones: [] },
	],
};

const encode = (value: unknown) => JSON.stringify(value);

test("accepts every server message type", () => {
	const messages = [
		{ type: "joined", color: "White", seatToken: "t", game },
		{ type: "state", game },
		{ type: "rejected", rejection: { reason: "staleRevision" }, revision: 4 },
		{ type: "error", message: "Malformed command" },
	];
	for (const message of messages) expect(parseServerMessage(encode(message))).toEqual(message);
});

test("rejects malformed messages", () => {
	const invalid = [
		"not json",
		encode(null),
		encode([]),
		encode({ type: "unknown" }),
		encode({ type: "state" }),
		encode({ type: "state", game: { ...game, revision: -1 } }),
		encode({ type: "state", game: { ...game, config: { ...game.config, boardSize: 7 } } }),
		encode({ type: "state", game: { ...game, moves: [{ move: { type: "play", color: "Black" } }] } }),
		encode({ type: "joined", color: "Red", seatToken: "t", game }),
		encode({ type: "rejected", rejection: {}, revision: 1 }),
		encode({ type: "error" }),
	];
	for (const text of invalid) expect(parseServerMessage(text), text).toBeNull();
});
