function copy(id) {
    const copyText = document.getElementById(id).value
    const button = document.getElementById("copy-" + id)
    navigator.clipboard.writeText(copyText)
    button.innerText = "✅"
}