<script setup lang="ts">
import { ref, type Ref } from 'vue'
import type { Jobs } from '../../../../server/types/Jobs.ts'
import apiClient from '../../api/axios.ts'

const dummyJob: Ref<Jobs> = ref({
    role: '',
    company: '',
    dateApplied: '',
    status: '',
    notes: '',
    location: '',
    workArrangement: '',
    link: '',
    type: '',
    salaryType: '',
    salary: ''
})

async function pushJob() {
    console.log('pushing job')
    try {
        const response = await apiClient.post('/createJob', dummyJob.value);
        console.log("SUCCESS: Posted job", response)
    } catch(error){
        console.log("ERROR: Could not post job.", error);
    }
}

function upper(word: string) {
  let split = word.split(/(?=[A-Z])/)
  let r = ''
  split.forEach((w: string) => {
    r += w.charAt(0).toUpperCase() + w.substring(1) + " "
  })
  return r.trim()
}

</script>

<template>
    <div class="project-card border p-3 mt-3 mb-3 rounded shadow-sm">
        <div v-for="(value, key) in dummyJob" :key="key">
            <p>{{ upper(key) }}</p>
            <div v-if="key === 'dateApplied'">
                <input type="date" class="form-control" v-model="dummyJob[key]" :placeholder="upper(key)" required>
            </div>
            <div v-else>
                <input type="text" class="form-control" v-model="dummyJob[key]" :placeholder="upper(key)" required>
            </div>
        </div>
    </div>
    <button @click="pushJob" class="btn btn-primary">Save</button>
</template>