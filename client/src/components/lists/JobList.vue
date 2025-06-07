<script setup lang="ts">
import JobCard from '../cards/JobCard.vue'
import type { Jobs } from '../../../../server/types/Jobs.ts'
import JobTable from '../tables/JobTable.vue'

const props = defineProps<{
    jobs: Jobs[]
}>()


console.log("ProjectList props", props)
</script>

<template>
    <div id="project-list">
        <span class="d-block d-lg-none ">
            <JobCard v-for="job in jobs" :job="job" />
        </span>

        <span class="d-none d-lg-block">
            <JobTable :jobs="jobs"/>
        </span>
    </div>
</template>