<script setup lang="ts">
import { ref } from 'vue'
import apiClient from '../../api/axios.ts'
import ProjectList from '../lists/ProjectList.vue'
import AddProjectCard from '../cards/AddProjectCard.vue'

const showAddCard = ref(false)
const jobs = ref([])
const fetchJobs = async(api: string) => {
    try {
        const response = await apiClient.get('/'+api);
        console.log("SUCCESS: Fetched jobs", response)
        jobs.value = response.data;
    } catch(error){
        console.log("ERROR: Could not load jobs.", error);
    }
}

fetchJobs('getJobs')

</script>

<template>
    <div id="jobs-page" class="m-3 p-3">
        <h2>Jobs</h2>
        <ProjectList :projects="jobs"/>
        <div v-if="!showAddCard">
            <button type="button" class="btn btn-primary" @click="showAddCard= true">+ job</button>
        </div>
        <div v-if="showAddCard">
            <AddProjectCard/>
            <!-- <button class="btn btn-primary" @click="showAddCard=false">save</button> -->
        </div>
    </div>
</template>