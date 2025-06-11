<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { upper } from '../../utilities/helpers.ts'
import * as JobFields from '../../../../server/types/Jobs.ts'
import apiClient from '../../api/axios.ts'
import DatePicker from '../inputs/job/DatePicker.vue'
import Text from '../inputs/job/Text.vue'
import Number from '../inputs/job/Number.vue'
import Radio from '../inputs/job/Radio.vue'

const props = defineProps<{
    job: JobFields.Jobs
}>();

const dummyJob: Ref<JobFields.Jobs> = ref({
    _id: props.job._id ?? '',
    role: props.job.role ?? '',
    company: props.job.company ?? '',
    dateApplied: props.job.dateApplied ?? '',
    status: props.job.status ?? JobFields.status.applied,
    notes: props.job.notes ?? '',
    location: props.job.location ?? '',
    workArrangement: props.job.workArrangement ?? JobFields.workArrangement.hybrid,
    link: props.job.link ?? '',
    type: props.job.type ?? JobFields.workType.contract,
    salaryType: props.job.salaryType ?? JobFields.salaryType.hourly,
    salary: props.job.salary ?? ''
})

const dummyValidation: Ref<Record<string, boolean>> = ref({
    role: true,
    company: true,
    dateApplied: true,
    status: true,
    notes: true,//optional
    location: true,//optional
    workArrangement: true,
    link: true, //optional
    type: true,
    salaryType: true,
    salary: true
})

const fields = [
    { label: 'role' as keyof JobFields.Jobs},
    { label: 'company' as keyof JobFields.Jobs },
    { label: 'status' as keyof JobFields.Jobs},
    { label: 'dateApplied' as keyof JobFields.Jobs },
    { label: 'notes' as keyof JobFields.Jobs},
    { label: 'location' as keyof JobFields.Jobs },
    { label: 'workArrangement' as keyof JobFields.Jobs },
    { label: 'link' as keyof JobFields.Jobs },
    { label: 'salaryType' as keyof JobFields.Jobs},
    { label: 'type' as keyof JobFields.Jobs },
    { label: 'salary' as keyof JobFields.Jobs}
]

const emit = defineEmits(['job-updated'])

async function updateJob() {
    let update = true
    Object.values(dummyValidation.value).forEach(validation => {
        if (validation === false) {
            console.log("ERROR: Cannot push job, invalid field provided.", dummyValidation)
            update = false
            return
        }
    });

    if (update) {
        try {
            await apiClient.patch('updateJob/' + dummyJob.value._id, dummyJob.value)
            emit('job-updated')
            console.log("SUCCESS: Updated job.")
        } catch (err) {
            console.log("ERROR: Could not update job",err)
        }
    }
}

async function deleteJob() {
    try {
        await apiClient.patch('deleteJob/' + dummyJob.value._id)
        emit('job-updated')
        console.log("SUCCESS: Deleted job.")
    } catch(err) {
        console.log("ERROR: Could not delete job.", err)
    }
}

function setDate(date: string) {
    if (typeof date === 'string') {
        dummyJob.value.dateApplied = date
        dummyValidation.value.dateApplied = true
    } else {
        console.log('ERROR: Invalide date provided')
    }

}

function keyExists(key: string): boolean{
    fields.forEach((label) => {
        if (label.label === key) {
            return true
        }
    })
    return false
}

function setText(text: string, key: string) {
    if (!keyExists) {
        console.log("ERROR: Cannot update job due to invalid key:", key)
    } else {
        (dummyJob.value as any)[key] = text;
        (dummyValidation as any)[key] = true;
        console.log("SUCCESS: Updated dummyJob (key,val):", key, (dummyJob.value as any)[key])      
    }
}

function setSelection(selected: string, key: string) {
    if (!keyExists) {
        console.log("ERROR: Cannot update job due to invalid key:", key)
    } else {
        (dummyJob.value as any)[key] = selected;
        (dummyValidation as any)[key] = true;
        console.log("SUCCESS: Updated dummyJob (key,val):", key, (dummyJob.value as any)[key])    
    }
}

function resetText(key: string) {
    if (!keyExists) {
        console.log("ERROR: Cannot update job due to invalid key:", key)
    } else {
        (dummyJob.value as any)[key] = (props.job as any)[key];
        (dummyValidation as any)[key] = true;
        console.log("SUCCESS: Reset dummyJob (key,val):", key, (dummyJob.value as any)[key])    
    }
}

function resetDate() {
    dummyJob.value.dateApplied = ''
    dummyValidation.value.dateApplied = false
    console.log(dummyValidation)
}

</script>

<template>
    <div class="job-card-full border p-4 mt-3 mb-3 rounded shadow-sm bg-white">
        <div id="header" class="card-title d-flex flex-column justify-content-between">
            <h2>{{ job.role }}</h2>
        </div>

        <div id="body" class="card-body">
            <div v-for="field in fields">
                {{ upper(field.label) }}

                <div v-if="field.label === 'salary'" class="d-flex align-items-center">
                    $<Number mode="edit" :input="job[field.label].toString()" @text-number-provided="(textInput) => setText(textInput, field.label)" @text-number-rejected="resetText(field.label)"/>
                </div>
                <div v-else-if="field.label === 'dateApplied'">
                    <DatePicker 
                        mode="edit"
                        :date="job.dateApplied.substring(0,10)"
                        @date-selected="setDate"
                        @date-rejected="resetDate"    
                    />
                </div>
                <div v-else-if="field.label === 'status' || field.label === 'workArrangement' || field.label === 'salaryType'">
                    <Radio :input="job[field.label]" :name="field.label" :structure="JobFields[field.label]" :items="JobFields[field.label]" @radio-selected="(selectedItem) => setSelection(selectedItem, field.label)"/>
                </div>
                <div v-else-if="field.label === 'type'">
                    <Radio :input="job[field.label]" :name="field.label" :structure="JobFields.workType" :items="JobFields.workType" @radio-selected="(selectedItem) => setSelection(selectedItem, field.label)"/>
                </div>
                <div v-else>
                    <Text :input="job[field.label]" mode="edit" @text-provided="(textInput) => setText(textInput, field.label)" @text-rejected="resetText(field.label)"/>
                </div>
            </div>


            <div class="d-flex flex-row">
                <button @click="updateJob" class="btn btn-primary m-3">save</button>
                <button @click="emit('job-updated')" class="btn btn-danger m-3">cancel</button>
                <button @click="deleteJob" class="btn btn-secondary m-3">delete</button>
            </div>
        </div>

    </div>
</template>

<style>
.job-card-full {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  /* max-width: 600px; */
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1.5rem;
  box-sizing: border-box;
}
</style>