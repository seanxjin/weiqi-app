import { useEffect, useRef } from "react";
import { animate } from "motion";
import type { AnimationPlaybackControls } from "motion";
import { BoardCanvas, StoneCanvas } from "./board";
import { StoneMark } from "./StoneMark";
import { boardThemes, welcomeBoardGeometry } from 'weiqi_board';
import type { BoardGeometry, BoardThemeId, StoneStyleId } from 'weiqi_board';
import type { AnimatedBoardMove } from "./AnimatedBoardScene.types";
import "./AnimatedBoardScene.css";

interface AnimatedBoardSceneProps {
	boardTheme: BoardThemeId;
	stoneStyle: StoneStyleId;
	moves: readonly AnimatedBoardMove[];
	duration: number;
	geometry?: BoardGeometry;
	paused: boolean;
	reducedMotion: boolean;
	onTogglePause?: () => void;
	showCaption?: boolean;
}

const stoneDiameter = 28;
const easing = ["easeOut", "easeOut", "linear"] as const;

export function AnimatedBoardScene({
	boardTheme,
	stoneStyle,
	moves,
	duration,
	geometry = welcomeBoardGeometry,
	paused,
	reducedMotion,
	onTogglePause,
	showCaption = true,
}: AnimatedBoardSceneProps) {
	const stage = useRef<HTMLDivElement>(null);
	const playback = useRef<AnimationPlaybackControls[]>([]);

	useEffect(() => {
		if (reducedMotion || !stage.current) return;
		const elements = stage.current.querySelectorAll<HTMLElement>("[data-move]");
		// Created together in one effect: Motion starts all tracks on the same frame.
		const controls = moves.map((move, index) =>
			animate(
				elements[index],
				{
					opacity: [0, 0, 1, 1],
					// 25% of the 28-unit body = Figma's seven-unit settle, at every board size.
					y: ["-25%", "-25%", "0%", "0%"],
				},
				{
					opacity: {
						duration,
						times: move.opacityTimes,
						ease: [...easing],
						repeat: Infinity,
					},
					y: {
						duration,
						times: move.landingTimes,
						ease: [...easing],
						repeat: Infinity,
					},
				},
			),
		);
		playback.current = controls;
		return () => {
			controls.forEach((control) => control.stop());
			playback.current = [];
		};
	}, [duration, moves, reducedMotion]);

	useEffect(() => {
		playback.current.forEach((control) =>
			paused ? control.pause() : control.play(),
		);
	}, [paused, reducedMotion, duration, moves]);

	return (
		<figure
			className="animated-board"
			aria-label={`A ${geometry.intersections} by ${geometry.intersections} Go board showing a sequence of ${moves.length} opening moves`}
		>
			<div
				className="animated-board__stage"
				ref={stage}
				data-static={reducedMotion}
			>
				<BoardCanvas
					theme={boardTheme}
					geometry={geometry}
					label={`${boardThemes[boardTheme].name} Go board`}
				/>
				<div className="animated-board__stones" aria-hidden="true">
					{moves.map((move, index) => (
						<div
							className="board-stone"
							key={move.nodeId}
							data-node-id={move.nodeId}
							data-move={index + 1}
							style={{
								left: `${((geometry.inset + move.column * geometry.spacing - stoneDiameter / 2) / geometry.size) * 100}%`,
								top: `${((geometry.inset + move.row * geometry.spacing - stoneDiameter / 2) / geometry.size) * 100}%`,
								width: `${(stoneDiameter / geometry.size) * 100}%`,
							}}
						>
							<StoneCanvas
								style={stoneStyle}
								color={move.color}
								size={stoneDiameter}
							/>
						</div>
					))}
				</div>
			</div>
			{showCaption && <figcaption className="animated-board__caption">
				<span>19 × 19</span>
				<div className="animated-board__controls">
					<button
						type="button"
						onClick={onTogglePause}
						aria-pressed={paused}
						aria-label={paused ? "Resume animations" : "Pause animations"}
					>
						{paused ? "RESUME" : "PAUSE"}
					</button>
					<StoneMark style={stoneStyle} size={22} horizontal />
				</div>
			</figcaption>}
		</figure>
	);
}
