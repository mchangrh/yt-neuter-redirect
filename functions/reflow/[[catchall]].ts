export interface Env {}

export const onRequest: PagesFunction<Env> = async (context) => {
	const { pathname } = new URL(context.request.url)
	const pathSplit = pathname.split("/")
	const number = pathSplit?.[2] ?? ''
	return handleReflow(number)
}
	

const shortenBase = "https://neuter.mchang.xyz"
const userscriptBase = "https://raw.githubusercontent.com/mchangrh/yt-neuter/main/userscripts/"

async function handleReflow (number: string): Promise<Response> {
	// validate number
	if (!number || (number !== "scale" && isNaN(parseInt(number)))) {
		return new Response("400 invalid scale", { status: 400 })
	}
	const base = await fetch(userscriptBase + "reflow.user.js").then(r => r.text())
	const linkReplace = new RegExp(userscriptBase + "reflow.user.js", "g")
	const newLink = base
		.replace(linkReplace, shortenBase + `/reflow/${number}/reflow.user.js`)
	const newFile = (number == "scale")
		? newLink.replace(/const scale = false;/, "const scale = true;")
		: newLink.replace(/const vidPerRow = \d/, `const vidPerRow = ${number}`)

	return new Response(newFile, { headers: { 'Content-Type': 'text/javascript' }})
}