import { renderCardToDataUri, ATTRIBUTE_NAMES, RANK_NAMES, SUIT_NAMES } from "card"
import type { CardRenderOptions } from "card"

function renderElement(el: PlayingCard): void {
	const attrs = el.constructor as typeof PlayingCard
	const options: CardRenderOptions = { cardcolor: "#FEFEFE" }
	for (const name of attrs.observedAttributes) {
		if (el.hasAttribute(name)) {
			const val = el.getAttribute(name)
			;(options as Record<string, unknown>)[name] = val || name
		}
	}

	const dataUri = renderCardToDataUri(options)

	if (el._img) {
		el._img.src = dataUri
	} else {
		el.innerHTML = ""
		el._img = document.createElement("img")
		el._img.src = dataUri

		// Derive alt text from resolved attributes
		const suit = Number(options.suit ?? 0)
		const rank = Number(options.rank ?? 1)
		el._img.alt = `${RANK_NAMES[rank] ?? "card"} of ${SUIT_NAMES[suit] ?? "spades"}`

		if (options.cid) {
			el._img.setAttribute("cid", String(options.cid))
		}

		el.appendChild(el._img)
	}
}

function dispatch(el: PlayingCard, eventName: string): void {
	el.dispatchEvent(new CustomEvent(eventName, {
		detail: el,
		bubbles: true,
		composed: true,
	}))
}

export class PlayingCard extends HTMLElement {
	_img: HTMLImageElement | null = null

	static get observedAttributes(): readonly string[] {
		return ATTRIBUTE_NAMES
	}

	constructor() {
		super()
		if (!this.hasOwnProperty("cid")) {
			for (const attr of ATTRIBUTE_NAMES) {
				Object.defineProperty(this, attr, {
					get: () => this.getAttribute(attr),
					set(value: string | null) {
						if (value) {
							this.setAttribute(attr, value)
						} else {
							this.removeAttribute(attr)
						}
					},
					configurable: true,
				})
			}
		}
	}

	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
		if (oldValue !== null) renderElement(this)
		if (name === "draggable" && this.firstChild) {
			(this.firstChild as Element).setAttribute(name, newValue ?? "")
		}
	}

	connectedCallback(): void {
		this.style.display = "inline-block"
		renderElement(this)
		dispatch(this, "CONNECTEDCARDT")
	}

	disconnectedCallback(): void {
		dispatch(this, "DISCONNECTEDCARDT")
	}
}

if (!customElements.get("playing-card")) {
	customElements.define("playing-card", PlayingCard)
}
