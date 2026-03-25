import { codeBlock } from '../../../../../utils'

const path = 'interactiveRebase'

const title = `Interactive rebase`

const codeBase = `console.log()`

const paragraph = `
${codeBlock(codeBase)}
`

export const interactiveRebaseData = {
  path,
  title,
  content: paragraph,
  practice: null,
}
