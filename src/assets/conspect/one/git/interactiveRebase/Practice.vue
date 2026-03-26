<script setup lang="ts">
import Mdblock from '@/components/Mdblock.vue'
import { codeBlock } from '@/utils'

const content = `
${codeBlock(
  `
  git rebase -i HEAD~10
  `,
  'CNS',
)}
`
</script>

<template>
  <div>
    <Mdblock :content="content" />
  </div>
</template>
