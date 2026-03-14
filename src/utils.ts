export function test() {
  console.error()
}

export function codeBlock(content: string): string {
  return `\`\`\`javascript${content}\`\`\`
  `
}
