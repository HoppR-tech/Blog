<script setup lang="ts">
import { Icon } from '#components'
import { makeFirstCharUpper } from '@/utils/helper'

interface Props {
  category: string
  icon: string
}

const props = defineProps<Props>()

const formattedCategory = computed(() => makeFirstCharUpper(props.category))
</script>

<template>
  <div class="container mx-auto">
    <div class="p-6 my-4 mx-2 rounded-md bg-gray-200 dark:bg-slate-900">
      <h1 class="text-black dark:text-white font-semibold leading-tight text-xl md:text-2xl flex items-center">
        <Icon :name="icon" size="32" class="mr-2" />
        {{ formattedCategory }}
      </h1>
    </div>
  </div>
</template>
