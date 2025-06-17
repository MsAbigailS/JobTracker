<script setup lang="ts">
import JobCard from '../cards/JobCard.vue'
import type { Jobs } from '../../../../server/types/Jobs.ts'
import JobTable from '../tables/JobTable.vue'

const props = defineProps<{
    jobs: Jobs[]
}>()

const emit = defineEmits<{
  (e: 'show-full-job-card', id: string): void
}>()

function bubble(id: string) {
    emit('show-full-job-card',id)
}
</script>

<template>
    <div id="project-list">
        <span class="d-block d-lg-none ">
            <JobCard v-for="job in jobs" :job="job" @show-full-job-card="bubble"/>
        </span>

        <span class="d-none d-lg-block">
            <JobTable :jobs="jobs" @show-full-job-card="bubble"/>
        </span>
    </div>
</template>