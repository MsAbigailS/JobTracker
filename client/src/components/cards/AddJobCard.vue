<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { upper } from '../../utilities/helpers.ts'
import * as JobFields from '../../../../server/types/Jobs.ts'
import apiClient from '../../api/axios.ts'
import DatePicker from '../inputs/job/DatePicker.vue'
import Text from '../inputs/job/Text.vue'
import Number from '../inputs/job/Number.vue'
import Radio from '../inputs/job/Radio.vue'

const errorMessage = {
    invalidInputs: {
        message: "Oops! Looks like you missed some required information.",
        active: false
    },
    serverError: {
        message: "Oops! Looks like the server is having issues. Please restart.",
        active: false
    }
}

const dummyJob: Ref<JobFields.Jobs> = ref({
    _id: '',
    role: '',
    company: '',
    dateApplied: '',
    status: JobFields.status.applied,
    notes: '',
    location: '',
    workArrangement: JobFields.workArrangement.hybrid,
    link: '',
    type: JobFields.workType.contract,
    salaryType: JobFields.salaryType.hourly,
    salary: ''
})

const dummyValidation: Ref<Record<string, boolean>> = ref({
    role: false,
    company: false,
    dateApplied: false,
    status: false,
    workArrangement: false,
    type: false,
    salaryType: false,
    salary: false
})

const helperText: Record<string, string> = {
    role: "Role name (i.e. \"Software Engineer\")",
    notes: "(Optional) any notes you want to add",
    link: "(Optional) reference link (i.e. job posting)",
    location: "(Optional)"
}

const emit = defineEmits(['job-added', 'cancel-job-add'])

function setErrorMessage(error: string) {
    if (error === 'invalid'){
        errorMessage.invalidInputs.active = true
    }
}

async function pushJob() {
    let push = true
    errorMessage.invalidInputs.active = false
    errorMessage.serverError.active = false
    Object.values(dummyValidation.value).forEach(validation => {
        if (validation === false) {
            push = false
            setErrorMessage('invalid')
            return
        }
    });

    if (!push) {
        console.log("ERROR: Unable to push jobs, validation requirements not met.")
        console.log(dummyValidation)
        setErrorMessage('invalid')
    }

    if(push){
        try {
            const response = await apiClient.post('/createJob', dummyJob.value);
            emit('job-added')
            errorMessage.invalidInputs.active = false
            console.log("SUCCESS: Posted job", response)
        } catch(error){
            console.log("ERROR: Could not post job.", error);
            errorMessage.serverError.active = true
        }      
    }
}

function keyExists(key: string): boolean{
    return Object.prototype.hasOwnProperty.call(dummyJob.value, key)
}

function setText(text: string, key:string){
    console.log("SETTING TEXT")
    if(!keyExists){
        console.log("ERROR: Cannot update job due to invalid key.")
    } else {
        (dummyJob.value as any)[key] = text;
        (dummyValidation.value as any)[key] = true;
        console.log("SUCCESS: Updated dummyJob (key,val):", key, (dummyJob.value as any)[key])
    }
}

function resetText(key:string){
    console.log("RESETTING TEXT")
    if(!keyExists){
        console.log("ERROR: Cannot reset job due to invalid key.")
    } else {
        (dummyJob.value as any)[key] = '';
        (dummyValidation.value as any)[key] = false;
        console.log("SUCCESS: Reset dummyJob (key,val):", key, (dummyJob.value as any)[key])
    }
}

function setSelection(selected: string, key: string) {
    if (!keyExists) {
        console.log("ERROR: Cannot update job due to invalid key:", key)
    } else {
        (dummyJob.value as any)[key] = selected;
        (dummyValidation.value as any)[key] = true;
        console.log("SUCCESS: Updated dummyJob (key,val):", key, (dummyJob.value as any)[key])    
    }
}

</script>

<template>
    <div class="job-card border p-3 m-3 rounded shadow-sm">

        <div v-for="(value,key) in dummyJob">
            <div v-if="key === 'status' || key === 'workArrangement' || key === 'salaryType'">
                {{ upper(key) }}
                <Radio 
                    :name="key" 
                    :structure="JobFields[key]" 
                    :items="JobFields[key]" 
                    @radio-selected="(selectedItem) => setSelection(selectedItem, key)"
                />
            </div>
            <div v-else-if="key === 'type'">
                {{ upper(key) }}
                <Radio 
                    :name="key" 
                    :structure="JobFields.workType" 
                    :items="JobFields.workType" 
                    @radio-selected="(selectedItem) => setSelection(selectedItem, key)"
                />
            </div>
            <div v-else-if="key === 'dateApplied'">
                {{ upper(key) }}
                <DatePicker 
                        mode="add"
                        @date-selected="(textInput) => setText(textInput, key)"
                        @date-rejected="resetText(key)"    
                    />
            </div>
            <div v-else-if="key === 'salary'">
                {{ upper(key) }}
                <div class="d-flex align-items-center">
                    $<Number 
                        mode="add" 
                        @text-number-provided="(textInput) => setText(textInput, key)" 
                        @text-number-rejected="resetText(key)"
                    />
                </div>
            </div>
            <div v-else-if="key === '_id'"></div>
            <div v-else>
                {{ upper(key) }}
                <Text
                    mode="add"
                    @text-provided="(textInput) => setText(textInput, key)" 
                    @text-rejected="resetText(key)"
                />
            </div>
        </div>
        
        <div class="pt-4">
            <div v-if="errorMessage.invalidInputs.active" >
                {{ errorMessage.invalidInputs.message }}
            </div>
            <button @click="pushJob" class="btn btn-primary m-3">save</button>
            <button @click="emit('cancel-job-add')" class="btn btn-danger m-3">cancel</button>
            <button @click="console.log(dummyValidation); console.log(dummyJob)" class="btn btn-danger m-3">test</button>

        </div>
    </div>
</template>
