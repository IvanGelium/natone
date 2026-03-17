export function test() {
  console.error()
}

export function codeBlock(content: string): string {
  return `\`\`\`javascript${content}\`\`\`
  `
}

const regex = /[^/]+$/
export function getGitHubLink(path: string) {
  const repo = 'IvanGelium/natone'
  const branch = 'main'
  const linkPath = new URL(path).pathname.replace(regex, 'Practice.vue')

  return `https://github.com/${repo}/blob/${branch}${linkPath}`
}
