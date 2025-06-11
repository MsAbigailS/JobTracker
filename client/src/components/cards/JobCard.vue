<script setup lang="ts">
import type { Jobs } from '../../../../server/types/Jobs.ts'
import { upper, dateToString, abbrevSalaryType, numberToMoney } from '../../utilities/helpers.ts'
import JobTags from '../tags/JobTags.vue'

const props = defineProps < {
  job?: Jobs
}>()

const emit = defineEmits<{
  (e: 'show-full-job-card', id: string): void
}>()
    
const fields = [
  { label: 'company' as keyof Jobs },
  { label: 'dateApplied' as keyof Jobs },
  { label: 'notes' as keyof Jobs},
  { label: 'location' as keyof Jobs },
  { label: 'workArrangement' as keyof Jobs },
  { label: 'link' as keyof Jobs },
  { label: 'salaryType' as keyof Jobs},
  { label: 'type' as keyof Jobs },
  { label: 'salary' as keyof Jobs}
]
</script>

<template>
  <div @click="emit('show-full-job-card', job?._id || '')" class="job-card border p-3 mt-3 mb-3 rounded shadow-sm">
    <div id="header" class="card-title d-flex flex-row justify-content-between">
      <h2>{{ job?.role }}</h2>
      <!-- <div>{{ job?.status }}</div> -->
       <JobTags :status="job?.status ?? ''"/>
    </div>

    <div id="body" class="card-body">
      <div v-for="(fields) in fields">
        <div v-if="job?.[fields.label as keyof Jobs]" class="card-row d-flex flex-row align-items-center border-bottom p-2"> <!-- ensuring only rows with values shown-->
          <div style="width:40%">{{ upper(fields.label ?? '') }}</div>
          <div v-if="fields.label == 'dateApplied'" style="width:60%">{{ dateToString(job?.[fields.label as keyof Jobs] ?? '') }}</div>
          <div v-else-if="fields.label == 'salary'" style="width:60%">${{ numberToMoney(job?.[fields.label as keyof Jobs]) }}/{{ abbrevSalaryType(job?.salaryType ?? '') }}</div>
          <div v-else style="width:60%">{{ job?.[fields.label as keyof Jobs] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.job-card:hover{
  border-color: rgba(49, 210, 242,0.4) !important;
  cursor: pointer;
}
</style>