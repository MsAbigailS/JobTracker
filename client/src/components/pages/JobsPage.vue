<script setup lang="ts">
import { ref } from 'vue'
import apiClient from '../../api/axios.ts'
import JobList from '../lists/JobList.vue'
import AddJobCard from '../cards/AddJobCard.vue'
import { scrollToTop, scrollTo } from '../../utilities/helpers.ts'

const showAddCard = ref(false)
const addJobCard = ref<HTMLElement | null>(null)
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
        <JobList :jobs="jobs"/>
        <div v-if="!showAddCard">
            <button type="button" class="btn btn-primary" @click="showAddCard = true">+ job</button>
        </div>
        <transition name="fade" mode="out-in" :duration="1000">
            <div v-if="showAddCard" ref="addJobCard">
                <AddJobCard @job-added="fetchJobs('getJobs'); showAddCard = false; scrollToTop()" @cancel-job-add="showAddCard = false; scrollToTop()"/>
            </div>
        </transition>
    </div>
</template>