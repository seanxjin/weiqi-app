import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { LocalBoard } from "@/components/game/local/LocalBoard";
import "@/styles/play.css";

export default function LocalPlayPage() {
	const { t } = useTranslation(["game", "common"]);
	const [params] = useSearchParams();
	const size = params.get("size");
	const boardSize = size === "9" ? 9 : size === "13" ? 13 : 19;
	useEffect(() => {
		document.title = t("common:pageTitle", { title: t("game:localPage.title") });
	}, [t]);
	return (
		<main className="local-play" id="main-content">
			<h1 className="local-play__title">{t("game:localPage.title")}</h1>
			<div className="local-play__board">
				<LocalBoard boardSize={boardSize} />
			</div>
		</main>
	);
}
