import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BoardCanvas, StoneCanvas } from "@/components/board";
import type { BoardThemeId, StoneStyleId } from "weiqi-board";
import "@/styles/material-library.css";

const boards: BoardThemeId[] = ["kaya", "walnut", "ash"];
const stones: StoneStyleId[] = ["polished", "satin", "matte", "snow"];

function MaterialLibraryPage() {
	const { t } = useTranslation(["play", "common"]);
	useEffect(() => {
		document.title = t("common:pageTitle", { title: t("play:materials.pageTitle") });
	}, [t]);
	return (
		<main className="material-library">
			<header className="page-header">
				<div className="eyebrow header-meta">
					<span>{t("play:materials.breadcrumb")}</span>
					<span>{t("play:materials.collection")}</span>
				</div>
				<h1>{t("play:materials.heading")}</h1>
				<p className="introduction">{t("play:materials.introduction")}</p>
			</header>
			<section className="boards-section" aria-labelledby="boards-title">
				<div className="section-heading">
					<h2 id="boards-title">
						<span className="section-number">01</span> {t("play:materials.boardsSection.title")}
					</h2>
					<p>{t("play:materials.boardsSection.meta")}</p>
				</div>
				<div className="boards-grid">
					{boards.map((theme, index) => (
						<figure className="board-sample" key={theme}>
							<BoardCanvas theme={theme} />
							<figcaption className="board-caption">
								<span className="sample-number">0{index + 1}</span>
								<div>
									<h3>{t(`play:materials.boards.${theme}.name`)}</h3>
									<p>{t(`play:materials.boards.${theme}.material`)}</p>
								</div>
							</figcaption>
						</figure>
					))}
				</div>
			</section>
			<section className="stones-section" aria-labelledby="stones-title">
				<div className="section-heading">
					<h2 id="stones-title">
						<span className="section-number">02</span> {t("play:materials.stonesSection.title")}
					</h2>
					<p>{t("play:materials.stonesSection.meta")}</p>
				</div>
				<div className="stone-study">
					<div className="eyebrow study-meta">
						<span>{t("play:materials.study.breadcrumb")}</span>
						<span>{t("play:materials.study.enlarged")}</span>
					</div>
					<div className="study-intro">
						<h3>{t("play:materials.study.heading")}</h3>
						<p>{t("play:materials.study.body")}</p>
					</div>
					<div className="stone-rows">
						{stones.map((style) => (
							<div className="stone-row" key={style}>
								<div className="material-notes">
									<p className="eyebrow">{t(`play:materials.stones.${style}.finish`)}</p>
									<h4>{t(`play:materials.stones.${style}.name`)}</h4>
									<p className="material-description">{t(`play:materials.stones.${style}.description`)}</p>
								</div>
								<div className="stone-pair">
									{(["black", "white"] as const).map((color) => (
										<figure className="stone-sample" key={color}>
											<StoneCanvas style={style} color={color} />
											<figcaption>{t(`play:materials.stones.${style}.${color}`)}</figcaption>
										</figure>
									))}
								</div>
							</div>
						))}
					</div>
					<div className="study-footer">
						<span>{t("play:materials.study.scale")}</span>
						<span>{t("play:materials.study.form")}</span>
					</div>
				</div>
			</section>
			<footer className="page-footer">
				<span>{t("common:appName")}</span>
				<span>{t("play:materials.footerTagline")}</span>
			</footer>
		</main>
	);
}

export default MaterialLibraryPage;
