import { join, dirname } from "node:path"

const distDir = join(dirname(import.meta.path), "dist")

const server = Bun.serve({
	port: 3000,
	async fetch(req) {
		let pathname = new URL(req.url).pathname
		if (pathname === "/") pathname = "/index.html"
		const file = Bun.file(join(distDir, pathname))
		if (await file.exists()) return new Response(file)
		return new Response("Not found", { status: 404 })
	},
})

console.log(`Serving example at http://localhost:${server.port}`)
