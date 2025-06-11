<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { salaryType, type Jobs, status, workArrangement, workType } from '../../../../server/types/Jobs.ts'
import { upper, dateToString, numberToMoney, abbrevSalaryType } from '../../utilities/helpers'
import JobTags from '../tags/JobTags.vue'

const props = defineProps < {
  job?: Jobs
}>()

const dummyValidation: Ref<Record<string, boolean>> = ref({
    role: false,
    company: false,
    dateApplied: false,
    status: false,
    notes: true,//optional
    location: true,//optional
    workArrangement: false,
    link: true, //optional
    type: false,
    salaryType: false,
    salary: false
})

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

const emit = defineEmits<{
  (e: 'edit-card', id: string): void
  (e: 'close-modal'): void
}>()
</script>

<template>
    <div class="job-card-full border bg-white p-6 mt-3 mb-3 rounded shadow-sm d-flex flex-column">
        <div id="header" class="card-title d-flex flex-row justify-content-between">
            <div>
                <h2>{{ job?.role }}</h2>
                <div class="d-flex">
                    <JobTags :status="job?.status ?? ''"/>
                </div>
            </div>
            <div>
                <button @click="emit('close-modal')" class="btn close-btn" aria-label="Close modal">&times;</button>
            </div>
        </div>

        <div id="body" class="card-body p-3">
            <div v-for="(fields) in fields">
                <div v-if="job?.[fields.label as keyof Jobs]" class="card-row d-flex flex-row align-items-center border-bottom p-2"> <!-- ensuring only rows with values shown-->
                    <div style="width:40%">{{ upper(fields.label ?? '') }}</div>
                    <div v-if="fields.label == 'dateApplied'" style="width:60%" >
                        
                            {{ dateToString(job?.[fields.label as keyof Jobs] ?? '') }}
                        
                    </div>
                    <div v-else-if="fields.label == 'salary'" style="width:60%" class="form-control-plaintext">${{ numberToMoney(job?.[fields.label as keyof Jobs]) }}/{{ abbrevSalaryType(job?.salaryType ?? '') }}</div>
                    <div v-else style="width:60%" class="form-control-plaintext">
                            {{ job?.[fields.label as keyof Jobs] }}
                            
                    </div>
                </div>
            </div>
        </div>

        <button @click="emit('edit-card', job?._id || '');emit('close-modal')" class="btn btn-sm btn-outline-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
            </svg>
            edit
        </button>
    </div>
</template>