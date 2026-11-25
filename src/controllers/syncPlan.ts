import type { Move } from "@/api/protocol";

export type SyncPlan =
	| { readonly kind: "same" }
	| { readonly kind: "append"; readonly from: number }
	| { readonly kind: "rebuild" };

export function sameMove(a: Move, b: Move): boolean {
	if (a.type !== b.type || a.color !== b.color) return false;
	return a.type === "pass" || (b.type === "play" && a.point.x === b.point.x && a.point.y === b.point.y);
}

/**
 * Decides how the local engine catches up with the server's move list: nothing to do (our own move
 * acknowledged), play the missing tail (opponent moves), or rebuild because the histories diverged.
 */
export function planSync(local: readonly Move[], server: readonly Move[]): SyncPlan {
	if (local.length > server.length) return { kind: "rebuild" };
	for (let index = 0; index < local.length; index++)
		if (!sameMove(local[index], server[index])) return { kind: "rebuild" };
	return local.length === server.length ? { kind: "same" } : { kind: "append", from: local.length };
}
