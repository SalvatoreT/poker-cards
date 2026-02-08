import { join, dirname } from "node:path"
import { mkdir } from "node:fs/promises"
import { renderCard } from "poker-cards"

const dir = dirname(import.meta.path)
const outdir = join(dir, "dist")

// Bundle HTML + JS
await Bun.build({
	entrypoints: [join(dir, "index.html")],
	outdir,
	minify: true,
})

// Generate card SVGs
const suits = ["spades", "hearts", "diamonds", "clubs"] as const
const ranks = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"] as const
const cardDir = join(outdir, "card")
await mkdir(cardDir, { recursive: true })
for (const suit of suits) {
	for (const rank of ranks) {
		await Bun.write(join(cardDir, `${suit}-${rank}.svg`), renderCard({ suit, rank }))
	}
}
console.log(`Generated ${suits.length * ranks.length} card SVGs`)
