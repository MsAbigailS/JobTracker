<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { upper } from '../../utilities/helpers.ts'
import * as JobFields from '../../../../server/types/Jobs.ts'
import type { CustomFields } from '../../../../server/types/Jobs.ts'
import apiClient from '../../api/axios.ts'
import DatePicker from '../inputs/job/DatePicker.vue'
import Text from '../inputs/job/Text.vue'
import Number from '../inputs/job/Number.vue'
import Radio from '../inputs/job/Radio.vue'
import Custom from '../inputs/custom/Custom.vue'


const props = defineProps<{
    job: JobFields.Jobs
}>();

const jobApplication: Ref<Omit<JobFields.Jobs, 'customFields'> & { customFields: Record<string, any> }> = ref({
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
    salary: props.job.salary ?? '',
    customFields: props.job.customFields ?? null
})

const jobApplicationValidation: Ref<Record<string, boolean | Record<string, boolean>>> = ref({
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
    salary: true,
    customFields: true
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
    { label: 'salary' as keyof JobFields.Jobs },
    { label: 'customFields' as keyof JobFields.Jobs}
]

const emit = defineEmits(['job-updated'])
const creatingCustomFields = ref(false)

async function updateJob() {
    let update = true
    Object.values(jobApplicationValidation.value).forEach(validation => {
        if (validation === false) {
            console.log("ERROR: Cannot push job, invalid field provided.", jobApplicationValidation)
            update = false
            return
        }
    });

    if (update) {
        console.log(jobApplication)
        try {
            await apiClient.patch('updateJob/' + jobApplication.value._id, jobApplication.value)
            emit('job-updated')
            console.log(jobApplication)
            console.log("SUCCESS: Updated job.")
        } catch (err) {
            console.log("ERROR: Could not update job",err)
        }
    }
}

async function deleteJob() {
    try {
        await apiClient.patch('deleteJob/' + jobApplication.value._id)
        emit('job-updated')
        console.log("SUCCESS: Deleted job.")
    } catch(err) {
        console.log("ERROR: Could not delete job.", err)
    }
}

function setDate(date: string) {
    if (typeof date === 'string') {
        jobApplication.value.dateApplied = date
        jobApplicationValidation.value.dateApplied = true
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

function isCustomField(key: string): boolean{
    let flag = false;
    (Object.values(jobApplication.value.customFields) as any[]).forEach((customField: any) => {
        if (customField.key === key) {
            console.log("key found")
            flag = true
            
        }
    })

    return flag
}

const customFieldRef = ref()

function setText(text: string, key: string) {
    console.log("setting text:", key, ":", text);
    if (isCustomField(key)) {
        jobApplication.value.customFields[key].content = text
    } else {
        (jobApplication.value as any)[key] = text;
        jobApplicationValidation.value[key] = true;
    }
}

function setSelection(selected: string, key: string) {
    console.log("setting text:", key, ":", selected);
    (jobApplication.value as any)[key] = selected;
    jobApplicationValidation.value[key] = true;

}

function resetText(key: string) {
    console.log("setting text:", key);
    (jobApplication.value as any)[key] = '';
    jobApplicationValidation.value[key] = false;

}
function resetDate() {
    jobApplication.value.dateApplied = ''
    jobApplicationValidation.value.dateApplied = false
    console.log(jobApplicationValidation)
}

// utilizing key from newCustomField as key in jobApplication
function addCustomField(newCustomField: CustomFields) {
    jobApplication.value.customFields[newCustomField.key] = {
        key: newCustomField.key,
        type: newCustomField.type,
        content: newCustomField.content,
        options: newCustomField.options
    }

    customFieldRef.value?.resetCustomField()
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
                        :allowFuture="false"
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
                <div v-else-if="field.label === 'customFields'">
                    <div  v-for="customField in Object.values(job.customFields as Record<string, any>)">
                        {{ customField.key }}
                        <div v-if="customField.type === 'text'">
                            <Text :input="customField.content" :required="true" mode="edit" @text-provided="(textInput) => setText(textInput, customField.key)" @text-rejected="resetText(customField.key)"/>
                        </div>
                        <div v-else-if="customField.type === 'number'">
                            $<Number mode="edit" :input="customField.content" @text-number-provided="(textInput) => setText(textInput, customField.key)" @text-number-rejected="resetText(customField.key)"/>
                        </div>
                        <div v-else-if="customField.type === 'date'">
                            <DatePicker 
                                mode="edit"
                                :date="customField.content.substring(0,10)"
                                :allowFuture="true"
                                @date-selected="setDate"
                                @date-rejected="resetDate"  
                            />                        
                        </div>
                        <div v-else-if="customField.type === 'radio'">
                            <Radio :input="customField.content" :name="customField.key" :structure="customField.content" :items="customField.options" @radio-selected="(selectedItem) => setSelection(selectedItem, customField.key)"/>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <Text :input="job[field.label]" :required="true" mode="edit" @text-provided="(textInput) => setText(textInput, field.label)" @text-rejected="resetText(field.label)"/>
                </div>
            </div>


        <!-- triggering allowing for custom fields -->
        <button class="btn btn-primary m-3" @click="creatingCustomFields = true">+ field</button>

        <!-- creating custom fields -->
        <div
            id="custom-fields"
            v-if="creatingCustomFields"
        >
            <Custom 
                ref="customFieldRef" 
                @custom-field="(newCustomField) => addCustomField(newCustomField)"
            />
        </div>


        <div class="d-flex flex-row">
            <!-- <button @click="console.log(jobApplication)" class="btn btn-primary m-3">test</button> -->

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