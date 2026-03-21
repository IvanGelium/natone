export function test() {
  console.error()
}

export function codeBlock(content: string): string {
  return `\`\`\`javascript${content}\`\`\`
  `
}

export function getDocUrl(path: string) {
  const base = import.meta.env.VITE_GITHUB_REPO_URL
  return `${base}/${path}`
}
