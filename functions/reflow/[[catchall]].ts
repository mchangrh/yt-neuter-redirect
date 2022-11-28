export interface Env {}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		console.log(ctx)
		const { pathname } = new URL(request.url)
		return handleURL(pathname)
	},
};

const shortenBase = "https://neuter.mchang.xyz"
const userscriptBase = "https://raw.githubusercontent.com/mchangrh/yt-neuter/main/userscripts/"

async function handleReflow (number: string): Promise<Response> {
	const base = await fetch(userscriptBase + "reflow.user.js").then(r => r.text())
	const linkReplace = new RegExp(userscriptBase + "reflow.user.js", "g")
	const newLink = base
		.replace(linkReplace, shortenBase + `/reflow/${number}/reflow.user.js`)
	const newFile = (number == "scale")
		? newLink.replace(/const scale = false;/, "const scale = true;")
		: newLink.replace(/const vidPerRow = \d/, `const vidPerRow = ${number}`)

	return new Response(newFile, { headers: { 'Content-Type': 'text/javascript' }})
}

const handleURL = async (pathname: string) => {
	const pathSplit = pathname.split("/")
	const type = pathSplit?.[1] ?? ''
	const name = pathSplit?.[2] ?? ''
	if (type === "reflow") {
		return handleReflow(name)
	}
}