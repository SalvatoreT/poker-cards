// Import and register the <playing-card> web component
import "poker-card-element"
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
