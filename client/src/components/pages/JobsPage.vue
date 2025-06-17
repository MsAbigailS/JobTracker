<script setup lang="ts">
import { ref } from 'vue'
import apiClient from '../../api/axios.ts'
import JobList from '../lists/JobList.vue'
import AddJobCard from '../cards/AddJobCard.vue'
import FullJobCard from '../cards/FullJobCard.vue'
import EditJobCard from '../cards/EditJobCard.vue'
import { scrollToTop, scrollTo } from '../../utilities/helpers.ts'
import type { Jobs } from '../../../../server/types/Jobs.ts'

const showAddCard = ref(false)
const showFullJobCard = ref(false)
const showEditCard = ref(false)
const activeJobId = ref('')
const showFullJobIndex = ref(0) 
const showEditJobIndex = ref(0)
const addJobCard = ref<HTMLElement | null>(null)
const jobs = ref<Jobs[]>([])
const fetchJobs = async(api: string) => {
    try {
        const response = await apiClient.get('/'+api);
        console.log("SUCCESS: Fetched jobs")
        jobs.value = response.data;
    } catch(error){
        console.log("ERROR: Could not load jobs.", error);
    }
}

fetchJobs('getJobs')

function fullJobCard(id: string) {
    showFullJobCard.value = true
    activeJobId.value = id

    jobs.value.forEach((element: Jobs, index: number) => {
        if (element._id == id) {
            showFullJobIndex.value = index
        }
    });
}

function editCard(id: string) {
    showEditCard.value = true

    jobs.value.forEach((element: Jobs, index: number) => {
        if (element._id == id) {
            showEditJobIndex.value = index
        }
    });
}
</script>

<template>
    <div id="jobs-page" class="m-3 p-3">
        <h2>Jobs</h2>
        <JobList :jobs="jobs" @show-full-job-card="fullJobCard"/>
        <div v-if="!showAddCard">
            <button type="button" class="btn btn-primary" @click="showAddCard = true">+ job</button>
        </div>
        <transition name="fade" mode="out-in" :duration="1000">
            <div v-if="showAddCard" ref="addJobCard">
                <AddJobCard @job-added="fetchJobs('getJobs'); showAddCard = false; scrollToTop()" @cancel-job-add="showAddCard = false; scrollToTop()"/>
            </div>
        </transition>
        <transition name="fade" mode="out-in" :duration="1000">
            <div v-if="showFullJobCard" class="modal-overlay p-5">
                <FullJobCard :job="jobs[showFullJobIndex]" @close-modal="showFullJobCard=false" @edit-card="editCard"/>
            </div>
        </transition>
        <transition name="fade" mode="out-in" :duration="1000">
            <div v-if="showEditCard" class="modal-overlay p-5">
                <EditJobCard :job="jobs[showEditJobIndex]" @job-updated="fetchJobs('getJobs'); showEditCard = false; scrollToTop()"/>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>