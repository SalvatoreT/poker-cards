// Import and register the <playing-card> web component
import "poker-card-element"

// Map numeric suit/rank attributes to URL-friendly names
const suitNames = ["spades", "hearts", "diamonds", "clubs"] as const
const rankNames = ["", "ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"] as const

// Click any card to open its SVG
document.addEventListener("click", (e) => {
	const card = (e.target as Element).closest("playing-card")
	if (!card) return
	const suit = suitNames[Number(card.getAttribute("suit"))]
	const rank = rankNames[Number(card.getAttribute("rank"))]
	if (suit && rank) window.open(`/card/${suit}-${rank}.svg`, "_blank")
})

// Interactive card picker
const suitSelect = document.getElementById("suit-select") as HTMLSelectElement
const rankSelect = document.getElementById("rank-select") as HTMLSelectElement
const previewCard = document.getElementById("preview-card") as HTMLElement

function updatePreview(): void {
	previewCard.setAttribute("suit", suitSelect.value)
	previewCard.setAttribute("rank", rankSelect.value)
}

suitSelect.addEventListener("change", updatePreview)
rankSelect.addEventListener("change", updatePreview)

// Random hand button
const randomHandBtn = document.getElementById("random-hand-btn") as HTMLButtonElement
const handContainer = document.getElementById("hand-container") as HTMLElement

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateRandomHand(): void {
	handContainer.innerHTML = ""
	const usedCards = new Set<string>()

	while (usedCards.size < 5) {
		const suit = randomInt(0, 3)
		const rank = randomInt(1, 13)
		const key = `${suit}-${rank}`
		if (!usedCards.has(key)) {
			usedCards.add(key)
			const card = document.createElement("playing-card")
			card.setAttribute("suit", String(suit))
			card.setAttribute("rank", String(rank))
			handContainer.appendChild(card)
		}
	}
}

randomHandBtn.addEventListener("click", generateRandomHand)

// Generate initial hand
generateRandomHand()

// Populate card grids with images from /card/ route
const ranks = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"]
for (const grid of document.querySelectorAll<HTMLElement>(".card-grid[data-suit]")) {
	const suit = grid.dataset.suit!
	for (const rank of ranks) {
		const url = `/card/${suit}-${rank}.svg`
		const a = document.createElement("a")
		a.href = url
		a.target = "_blank"
		const img = document.createElement("img")
		img.src = url
		img.alt = `${rank} of ${suit}`
		a.appendChild(img)
		grid.appendChild(a)
	}
}
