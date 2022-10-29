export interface Env {
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const { pathname } = new URL(request.url)
		return handleURL(pathname)
	},
};

const urlRedirect = (url: string): Response => new Response(null,  { status: 302, headers: { 'Location': url }})


const filters = [
	"funkey",
	"misc",
	"nolive",
	"noshorts",
	"notrack"
]
const userscripts = [
	"reflow",
	"yt-no-autoplay"
]
const defaultFilter = "https://raw.githubusercontent.com/mchangrh/yt-neuter/main/yt-neuter.txt"
const filterBase = "https://raw.githubusercontent.com/mchangrh/yt-neuter/main/filters/"
const userscriptBase = "https://raw.githubusercontent.com/mchangrh/yt-neuter/main/userscripts/"

const help = `
This is the root of the yt-neuter redirect
GitHub: https://github.com/mchangrh/yt-neuter
filter lists: ${JSON.stringify(filters)}
userscripts: ${JSON.stringify(userscripts)}

/reflow customization:
  - /reflow/# will give you a script that will give you # videos per row
`

const handleURL = async (pathname: string) => {
	const pathSplit = pathname.split("/")
	if (pathname === "/") return new Response(help, { status: 200 })
	const filterName = pathSplit?.[1] ?? ''
	if (!filterName?.length) return urlRedirect(defaultFilter)
	if (filters.includes(filterName)) return urlRedirect(filterBase + filterName + ".txt")
	// filtering for reflow
	if (filterName == "reflow") {
		const number = pathSplit?.[2] ?? 6;
		const base = await fetch(userscriptBase + "reflow.user.js").then(r => r.text())
		const newFile = base.replace(/const vidPerRow = \d/, `const vidPerRow = ${number}`)
		return new Response(newFile, { headers: { 'Content-Type': 'text/javascript' }})
	}
	else if (userscripts.includes(filterName)) return urlRedirect(userscriptBase + filterName + ".user.js")
	else return urlRedirect(defaultFilter)
  }