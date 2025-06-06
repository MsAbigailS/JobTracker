<script lang="ts" setup>
import { ref } from 'vue';
import apiClient from '../api/axios'; // make sure this is configured with baseURL

const jobs = ref([]);
const fetchJobs = async () => {
  try {
    const response = await apiClient.get('/getJobs');
    console.log('Fetched jobs:', response.data);
    jobs.value = response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }
};

fetchJobs();
</script>

<template>
  <div>
    <h1>Jobs</h1>
    <button @click="fetchJobs">Load Jobs</button>
    <ul v-if="jobs.length">
      <li v-for="job in jobs" :key="job._id">
        {{ job.role }} at {{ job.company }}
      </li>
    </ul>
    <p v-else>No jobs found.</p>
  </div>
</template>
