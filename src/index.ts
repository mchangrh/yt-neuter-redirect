export interface Env {}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const { pathname } = new URL(request.url)
		return handleURL(pathname)
	},
};

const urlRedirect = (url: string): Response => new Response(null,  { status: 302, headers: { 'Location': url }})

const filters = [
	"misc",
	"nolive",
	"noshorts",
	"notrack",
	"reflow"
]
const userscripts = [
	"reflow",
	"yt-no-autoplay"
]

const shortenBase = "https://neuter.mchang.xyz"
const githubBase = "https://raw.githubusercontent.com/mchangrh/yt-neuter/main/"
const defaultFilter = githubBase + "yt-neuter.txt"
const filterBase = githubBase + "filters/"
const userscriptBase = githubBase + "userscripts/"
const githubLink = "https://github.com/mchangrh/yt-neuter"

const help = `
This is the root of the yt-neuter redirect
GitHub:
	${githubLink}
Base Filter:
	${shortenBase}/filter
Filter Lists:
${filters.map(u => "\t" + shortenBase + "/filter/" + u).join("\n")}
Userscripts:
${userscripts.map(u => "\t" + shortenBase + "/script/" + u).join("\n")}

/reflow customization:
	${shortenBase}/reflow/#/reflow.user.js
	
	returns customized script that will give you # videos per row
`

async function handleReflow (number: string): Promise<Response> {
	const base = await fetch(userscriptBase + "reflow.user.js").then(r => r.text())
	const linkReplace = new RegExp(userscriptBase + "reflow.user.js", "g")
	const newFile = base
		.replace(/const vidPerRow = \d/, `const vidPerRow = ${number}`)
		.replace(linkReplace, shortenBase + `/reflow/${number}/reflow.user.js`)
	return new Response(newFile, { headers: { 'Content-Type': 'text/javascript' }})
}

const handleURL = async (pathname: string) => {
	const pathSplit = pathname.split("/")
	if (pathname === "/") return new Response(help, { status: 200 })
	const type = pathSplit?.[1] ?? ''
	const name = pathSplit?.[2] ?? ''
	if (type === "github") {
		return urlRedirect(githubLink)
	} else if (type === "filter") {
		if (name === "") return urlRedirect(defaultFilter)
		if (filters.includes(name)) return urlRedirect(filterBase + name + ".txt")
	} else if (type === "script") {
		if (userscripts.includes(name)) return urlRedirect(userscriptBase + name + ".user.js")
	} else if (type === "reflow") {
		return handleReflow(name)
	}
	return new Response(help, { status: 200 })
}