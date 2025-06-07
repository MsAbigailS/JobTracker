<script setup lang="ts">
import ProjectCard from '../cards/ProjectCard.vue'
import type { Jobs } from '../../../../server/types/Jobs.ts'


const props = defineProps<{
    projects: Jobs[]
}>()


console.log("ProjectList props", props)
</script>

<template>
    <div id="project-list">
        <ProjectCard v-for="project in projects" :project="project" />
    </div>
</template>