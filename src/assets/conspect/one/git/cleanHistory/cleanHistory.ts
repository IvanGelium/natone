import { codeBlock } from '../../../../../utils'

const path = 'cleanHistory'

const title = `Чистая история коммитов`

const codeBase = `a`

const paragraph = `
${codeBlock(codeBase)}
`

export const cleanHistoryData = {
  path,
  title,
  content: paragraph,
  practice: null,
}
