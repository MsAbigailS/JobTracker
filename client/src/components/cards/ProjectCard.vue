<script setup lang="ts">
import type { Jobs } from '../../../../server/types/Jobs.ts'

const props = defineProps < {
  project?: Jobs
}>()
    
const fields = [
  { label: 'company' as keyof Jobs },
  { label: 'dateApplied' as keyof Jobs },
  { label: 'notes' as keyof Jobs},
  { label: 'location' as keyof Jobs },
  { label: 'workArrangement' as keyof Jobs },
  { label: 'link' as keyof Jobs },
  { label: 'salaryType' as keyof Jobs},
  { lable: 'type' as keyof Jobs },
  { label: 'salary' as keyof Jobs}
]

function upper(word: string) {
  let split = word.split(/(?=[A-Z])/)
  let r = ''
  split.forEach((w: string) => {
    r += w.charAt(0).toUpperCase() + w.substring(1) + " "
  })
  return r.trim()
}

function dateToString(date: string) {
  return date.substring(0,4) + '/' + date.substring(5,7) + '/' + date.substring(8,10)
}

function abbrevSalaryType(salaryType: string) {
  return salaryType === 'yearly' ? 'yr' : salaryType === 'monthly' ? 'month' : salaryType === 'hourly' ? 'hr' : ''
}
</script>

<template>
  <div class="project-card border p-3 mt-3 mb-3 rounded shadow-sm">
    <div id="header" class="card-title d-flex flex-row justify-content-between">
      <h2>{{ project?.role }}</h2>
      <div>{{ project?.status }}</div>
    </div>

    <div id="body" class="card-body hover:shadow-lg hover:bg-success-subtle">
      <div v-for="(fields) in fields">
        <div v-if="project?.[fields.label as keyof Jobs]" class="card-row d-flex flex-row align-items-center border-bottom p-2"> <!-- ensuring only rows with values shown-->
          <div style="width:40%">{{ upper(fields.label ?? '') }}</div>
          <div v-if="fields.label == 'dateApplied'" style="width:60%">{{ dateToString(project?.[fields.label as keyof Jobs] ?? '') }}</div>
          <div v-else-if="fields.label == 'salary'" style="width:60%">${{ project?.[fields.label as keyof Jobs] }}/{{ abbrevSalaryType(project?.salaryType ?? '') }}</div>
          <div v-else style="width:60%">{{ project?.[fields.label as keyof Jobs] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
