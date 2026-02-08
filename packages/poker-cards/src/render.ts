import {
	SUIT_PATHS,
	RANK_PATHS,
	COURT_PATHS,
	RANK_NAMES,
	SUIT_NAMES,
	PIP_LAYOUTS,
} from "./data"
import type { CardRenderOptions } from "./types"

const NAME_TO_NUMBER: Record<string, number> = {
	ace: 1, a: 1,
	two: 2, three: 3, four: 4, five: 5, six: 6,
	seven: 7, eight: 8, nine: 9, ten: 10, t: 10,
	jack: 11, j: 11, queen: 12, q: 12, king: 13, k: 13,
	spades: 20, s: 20, hearts: 21, h: 21,
	diamonds: 22, d: 22, clubs: 23, c: 23,
}

function parseName(name: string): number {
	const lower = name.toLowerCase()
	const val = NAME_TO_NUMBER[lower]
	if (val !== undefined) return val > 19 ? val - 20 : val
	return Number(lower) || 0
}

function splitAndGet(value: string | string[]): string[]
function splitAndGet(value: string | string[], index: number): string
function splitAndGet(value: string | string[], index?: number): string | string[] {
	const arr = typeof value === "string"
		? (value.includes(",") ? value.split(",") : value.split(""))
		: value
	if (index !== undefined && index >= 0) return arr[index] ?? ""
	return arr
}

// ── SVG helpers (stateless) ─────────────────────────────────────────

function viewBox(size: number): string {
	return `${-size} ${-size} ${2 * size} ${2 * size}`
}

function svgFill(color: string): string {
	return `fill='${color}' fill-opacity='1'`
}

function svgStroke(color: string, width: string | number = "3", fill = "none"): string {
	return `stroke='${color}' ${svgFill(fill)} stroke-width='${width}'`
}

function svgDims(w?: number, h?: number, x?: number, y?: number, prefix = ""): string {
	return `${prefix}${w ? ` width='${w}'` : ""}${h ? ` height='${h}'` : ""}${x ? ` x='${x}'` : ""}${y ? ` y='${y}'` : ""}`
}

function svgRect(w: number, h: number, x: number, y: number, r: number, attrs: string): string {
	return `<rect${svgDims(w, h, x, y)} rx='${r}' ry='${r}' ${attrs}/>`
}

function svgText(
	text: string | number, x = 0, y = 0,
	stroke = "", fill = "", size = 20, spacing = -7, anchor = "middle",
): string {
	return `<text x='${x}' y='${y}' stroke='${stroke}' text-anchor='${anchor}' style='font-weight:600;stroke:none;font-family:arial;letter-spacing:${spacing}px;fill:${fill};font-size:${size}px;'>${text}</text>`
}

// ── Main render function ────────────────────────────────────────────

type UseArgs = [id: string, w: number, h: number, x: number, y: number, extra?: string]

export function renderCard(options: CardRenderOptions = {}): string {
	// Extract options with defaults
	let suit: number | string = options.suit ?? 0
	let rank: number | string = options.rank ?? 1
	let cid: string | false = options.cid ?? false
	let letters: string | false = options.letters ?? false
	const courts = options.courts ?? "012"
	const suitsVariant = options.suits ?? "0123"
	let suitColor = options.suitcolor ?? "#000,#f00,#f00,#000"
	const rankColor = options.rankcolor ?? "#000,#f00,#f00,#000"
	const shadow = options.shadow ?? "5,5,5"
	const shadowParts = shadow.split(",")
	let noRank: boolean | number = options.norank ?? false
	let backColor = options.backcolor ?? "#e55"
	let cardColor = options.cardcolor ?? "#fff"
	let opacity = options.opacity ?? 0.8
	const borderRadius = options.borderradius ?? 12
	const borderColor = options.bordercolor ?? "#444"
	const borderLine = String(options.borderline ?? "1")
	let courtColors = splitAndGet(options.courtcolors ?? "#db3,#f00,#44f,#000,#000,4")
	let backText = options.backtext ?? ""
	const backTextColor = options.backtextcolor ?? "#555"
	const showPips = options.showpips ?? 0
	const pipY = options.pipy ?? 0
	const svgAttrs = options.svg ?? ""

	// ── Parse CID ───────────────────────────────────────────────

	if (cid) {
		cid = cid.toUpperCase()
		if (cid.includes("-")) {
			const parts = cid.split("-OF-")
			cid = parts[0]![0]! + parts[1]![0]!
		}
		cid = cid.replace("10", "T")
		rank = cid[0]!
		suit = cid[1]!

		if (rank === "F") {
			// Face-down card
			backColor = "green"
			rank = 1
			noRank = 1
			opacity = 0.3
			cardColor = "transparent"
			letters = "    "
			if (suit === "F") {
				rank = 0
				suit = 0
				backColor = cardColor
				backText = ""
			} else {
				suit = parseName(suit as string)
			}
		}
	}

	if (typeof suit === "string") suit = parseName(suit)
	if (typeof rank === "string") rank = parseName(rank)

	// Check for empty court paths (lite version without court art)
	if (COURT_PATHS[0]?.[0]?.[0] === "") {
		// suitsVariant = "1111"
		if (suit === 0 || suit === 3) courtColors[2] = "#0303ff"
		if (suit === 2) courtColors[1] = "#dc143c"
	}

	if (suit > 3) suit = 3
	if (rank > 13) rank = 13

	const s = suit
	const t = rank

	// ── Build card ID for unique SVG element IDs ────────────────

	const rankChar = t > 1 && t < 10
		? String(t)
		: (RANK_NAMES[t] ?? RANK_NAMES[0]!)[0]!
	const suitChar = "shdc"[s] ?? "s"
	const cardId = rankChar + suitChar

	// ── SVG helpers that capture cardId / opacity ───────────────

	const svgUse = (id: string, w: number, h: number, x: number, y: number, extra = ""): string =>
		`<use href='#${id + cardId}'${svgDims(w, h, x, y)} ${extra}/>`

	const svgSymbol = (id: string, vb: string, path: string, attrs: string, useRefs: UseArgs[] = []): string =>
		`<symbol id='${id + cardId}' viewBox='${vb}' preserveAspectRatio='xMinYMid' opacity='${useRefs.length ? 1 : opacity}'>` +
		`<path d='${path}' ${attrs} ` +
		(id[0] === "S" && shadow ? `style='filter:drop-shadow(${shadowParts[0]}px ${shadowParts[1]}px ${shadowParts[2]}px rgba(0,0,0,.3))'` : "") +
		`/>${useRefs.map(a => svgUse(...a)).join("")}</symbol>`

	// ── Corner elements (rank + suit indicators) ────────────────

	const cornerElements = [
		svgUse(noRank ? "" : "R", 0, letters ? 50 : 39, letters ? -116 : -120, -158),
		svgUse(noRank ? "" : "S" + s, 0, 39, -120, -120),
	].join("")

	// ── Pip placement for number cards ──────────────────────────

	const allPips: string[] = []
	const debugPips: string[] = []
	const topHalfPips: string[] = []

	if (t > 0 && t < 11) {
		const layout = PIP_LAYOUTS[t]
		if (layout) {
			const chars = layout.split("")
			for (let idx = 0; idx < chars.length; idx++) {
				const ch = chars[idx]!
				let pipSize = 70
				const half = -pipSize / 2         // -35
				const quarter = -half / 2          // 17.5
				const negSize = -pipSize - quarter // -87.5
				let topY = (t === 9 || t === 10) ? -130 : -122
				let midY = -68.5
				topY -= pipY
				if (pipY) midY -= topY / 2.2

				const positions: [number, number][] = [
					[negSize, topY],  // 0
					[half, topY],     // 1
					[quarter, topY],  // 2
					[negSize, midY],  // 3
					[quarter, midY],  // 4
					[half, -102],     // 5
					[half, -90],      // 6
					[half, -90],      // 7
					[negSize, half],  // 8
					[half, half],     // 9
					[quarter, half],  // 10
				]

				const pos = positions[idx]
				if (ch !== "0" && pos) {
					let px = pos[0]
					let py = pos[1]
					if (t === 4) py += 30
					if (t === 1 && idx === 9) {
						px = -pipSize
						py = -pipSize
						pipSize *= 2
					}
					if ("SHDC".includes(ch)) {
						suit = "SHDC".indexOf(ch)
					}
					const pip = svgUse("S" + suit, 0, pipSize, px, py)
					allPips.push(pip)
					if (idx < 7) topHalfPips.push(pip)
				}

				if (showPips && pos) {
					debugPips.push(
						svgText("abcdefghijk"[idx]!, pos[0] + 27, pos[1] + 40, "#f00", "#f00", 40),
					)
				}
			}
		}
	}

	// ── Build SVG string ────────────────────────────────────────

	const borderWidth = Number(borderLine)
	let svg = `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='668' viewBox='-120 -167 240 334' ${svgAttrs}>`

	// Card background rectangle
	svg += svgRect(
		240 - borderWidth, 334 - borderWidth,
		borderWidth / 2 - 120, borderWidth / 2 - 167,
		borderRadius, svgStroke(borderColor, borderLine, cardColor),
	)

	// Drop shadow filter (kept as fallback for non-CSS-filter contexts)
	svg += `<filter id='SH'><feDropShadow dx='${shadowParts[0]}' dy='${shadowParts[1]}' stdDeviation='${shadowParts[2]}'/></filter>`

	if (t > 0) {
		// ── Front of card ───────────────────────────────────────

		// Rank symbol definition
		if (letters) {
			const letterParts = splitAndGet(letters)
			const first = letterParts.shift()!
			const rankLetter = [0, first, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...letterParts][t]
			const color = suitColor.includes(",") ? splitAndGet(suitColor, s) : suitColor
			svg += `<symbol id='R${cardId}' viewbox='${viewBox(500)}' opacity='${opacity}'>${svgText(rankLetter!, 1, 33, "", color, rankLetter === "W" ? 30 : 40, -7, "left")}</symbol>`
		} else {
			const color = rankColor.includes(",") ? splitAndGet(rankColor, s) : rankColor
			svg += svgSymbol("R", viewBox(500), RANK_PATHS[t]!, svgStroke(color, 110))
		}

		// Suit symbol definitions (all 4)
		for (let i = 0; i < 4; i++) {
			const color = suitColor.includes(",") ? splitAndGet(suitColor, s) : suitColor
			svg += svgSymbol("S" + i, viewBox(600), SUIT_PATHS[i]!, svgFill(color))
		}

		// Corners + pips + mirrored bottom half
		svg += `${cornerElements}${allPips.join("")}<g transform='rotate(180)'>${cornerElements}${topHalfPips.join("")}</g>`
		svg += debugPips.join("")
	} else {
		// ── Back of card ────────────────────────────────────────

		const backW = 240 - 2 * borderRadius
		const backH = 334 - 2 * borderRadius
		svg += `<pattern patternUnits='userSpaceOnUse' id='pa'${svgDims(10, 10)}><path d='M5 0L10 5L5 10L0 5Z' ${svgFill(backColor)}/></pattern>`
		svg += svgRect(backW, backH, -backW / 2, -backH / 2, borderRadius, svgFill("url(#pa)"))
		if (backText) svg += svgText(backText, 0, 10, "", backTextColor, 40, -2)
	}

	// ── Court cards (Jack, Queen, King) ─────────────────────────

	if (t > 10) {
		const mirroredUse = (...args: UseArgs): string =>
			svgUse(...args) + svgUse(args[0], args[1], args[2], args[3], args[4], "transform='rotate(180)'")

		const courtStyle = Number(splitAndGet(courts, t - 11)) || 0
		const suitVariant = Number(splitAndGet(suitsVariant, s)) || 0

		// Mirror table: determines if the card art is horizontally flipped
		const shouldMirror = [
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[1, 1, 1, 1],
		][courtStyle]?.[suitVariant]

		svg += shouldMirror ? "<g transform='scale(-1,1)'>" : "<g>"

		// Pip positions on court card artwork
		const courtPip = (size: number, cx: number, cy: number, transform = ""): UseArgs =>
			["S" + s, 0, size, cx, cy, `transform='${transform}'`]

		const courtPipPositions: UseArgs[][][] = [
			[ // Jack
				[courtPip(90, 1016, -78, "rotate(33)"), courtPip(100, 1010, 24, "rotate(33)"), courtPip(100, 1004, 140, "rotate(33)"), courtPip(130, 332, 492), courtPip(130, 334, 610)],
				[courtPip(114, 520, 939), courtPip(100, 1100, 60, "rotate(30)"), courtPip(100, 1100, 160, "rotate(30)"), courtPip(100, 440, 430, "rotate(30)"), courtPip(160, 370, 560, "rotate(30)")],
				[courtPip(200, 550, 903), courtPip(200, 60, 903), courtPip(50, 681, 631)],
				[courtPip(100, 460, 680), courtPip(100, 460, 800), courtPip(140, 760, 580)],
			],
			[ // Queen
				[courtPip(130, 300, 1080, "rotate(-33)"), courtPip(140, 254, 1250, "rotate(-33)"), courtPip(200, 330, 1380, "rotate(-33)")],
				[courtPip(80, 1140, 552, "rotate(10)"), courtPip(80, 1155, 660, "rotate(11)"), courtPip(85, 1240, 660, "rotate(17)"), courtPip(95, 1310, 660, "rotate(23)")],
				[courtPip(200, 550, 903), courtPip(180, 399, 420, "rotate(35)")],
				[courtPip(150, 25, 1320, "rotate(-45)"), courtPip(150, 44, 1480, "rotate(-45)")],
			],
			[ // King
				[courtPip(100, 960, 250, "rotate(20)"), courtPip(100, 955, 380, "rotate(20)"), courtPip(100, 180, 820, "rotate(-20)"), courtPip(100, 200, 680, "rotate(-20)")],
				[courtPip(100, 694, 870, "rotate(-15)"), courtPip(113, 932, 798, "rotate(0)"), courtPip(100, 1280, 230, "rotate(35)")],
				[courtPip(200, 550, 903), courtPip(130, 300, 760, "rotate(-5)"), courtPip(140, 90, 680, "rotate(-20)")],
				[courtPip(100, 1110, 10, "rotate(30)"), courtPip(115, 1025, 420, "rotate(15)"), courtPip(130, 823, 820)],
			],
		]

		// Suit symbol position on court cards
		const courtSuitPositions = [
			[[-88, -124], [35.8, -124], [30, -124], [30, -124]],
			[[35.8, -124], [-88, -124], [30, -124], [30, -124]],
			[[-88, -124], [-88, -124], [-82.5, -124], [-82.5, -124]],
		]
		const suitPos = courtSuitPositions[courtStyle]?.[suitVariant] ?? [-88, -124]

		// Court card artwork layers: gold, red, blue, black, detail
		const layerNames = ["go", "re", "bu", "ba", "de"]
		const layersHtml = layerNames.map((name, layerIdx) => {
			svg += svgSymbol(
				name,
				"0 0 1300 2000",
				COURT_PATHS[courtStyle]![layerIdx]![suitVariant]!,
				layerIdx < 4 ? svgFill(courtColors[layerIdx]!) : svgStroke(courtColors[4]!, courtColors[5]!),
				layerIdx < 4 ? [] : (courtPipPositions[courtStyle]?.[suitVariant] ?? []) as UseArgs[],
			)
			return mirroredUse(name, 165, 261, -82, -130)
		}).join("")

		svg += layersHtml

		// "DE" watermark on King of Hearts (courtStyle=2, suitVariant=1)
		if (courtStyle === 2 && suitVariant === 1) {
			svg += svgText("DE", -45, 102, "", "#777", 7, -1)
		}

		// Suit symbol on court card
		svg += mirroredUse("S" + s, 0, 52, suitPos[0]!, suitPos[1]!)

		// Court card border + close group
		svg += svgRect(166, 254, -83, -127, 2, svgStroke("#44f")) + "</g>"
	}

	// Ace of spades special mark
	if (!noRank && t === 1 && s === 0) {
		svg += svgText("\u2660", 1, 17, "#fff", "#ddd", 11, 0)
	}

	svg += "</svg>"
	return svg
}

/**
 * Render a playing card as a data URI suitable for use as an img src.
 * The returned string can be assigned directly to an HTMLImageElement.src.
 */
export function renderCardToDataUri(options: CardRenderOptions = {}): string {
	return "data:image/svg+xml," + renderCard(options).replace(/#/g, "%23")
}
