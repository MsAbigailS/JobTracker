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

const jobApplication: Ref<Omit<JobFields.Jobs, 'customFields'> & { customFields: Record<string, any> }> = ref({
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
    salary: '',
    customFields: {}
})

const jobApplicationValidation: Ref<Record<string, boolean | Record<string, boolean>>> = ref({
    role: false,
    company: false,
    dateApplied: false,
    status: false,
    workArrangement: false,
    type: false,
    salaryType: false,
    salary: false,
    customFields: {}
})

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

const emit = defineEmits(['job-added', 'cancel-job-add'])

const customFieldRef = ref()
const creatingCustomFields = ref(false)

function setErrorMessage(error: string) {
    if (error === 'invalid'){
        errorMessage.invalidInputs.active = true
    }
}

async function pushJob() {
    let push = true
    errorMessage.invalidInputs.active = false
    errorMessage.serverError.active = false
    Object.values(jobApplicationValidation.value).forEach(validation => {
        if (validation === false) {
            push = false
            setErrorMessage('invalid')
            return
        }
    });
    const customValidation = jobApplicationValidation.value.customFields || {}
    Object.values(customValidation).forEach(valid => {
        if (!valid) push = false
    })

    if (!push) {
        console.log("ERROR: Unable to push jobs, validation requirements not met.")
        console.log(jobApplicationValidation)
        setErrorMessage('invalid')
    }

    if(push){
        try {
            const response = await apiClient.post('/createJob', jobApplication.value);
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
    return Object.prototype.hasOwnProperty.call(jobApplication.value, key)
}

// utilizing key from newCustomField as key in jobApplication
function addCustomField(newCustomField: CustomFields) {
    jobApplication.value.customFields[newCustomField.key] = {
        key: newCustomField.key,
        type: newCustomField.type,
        content: newCustomField.content,
        options: newCustomField.options
  }

  console.log("setting jobapp custom", jobApplication)
    customFieldRef.value?.resetCustomField()
}
function setText(text: string, key: string) {
 if (keyExists(key)) {
    (jobApplication.value as any)[key] = text
    jobApplicationValidation.value[key] = true
  }
}

function resetText(key: string) {
  if (keyExists(key)) {
    (jobApplication.value as any)[key] = ''
    jobApplicationValidation.value[key] = false
  }
}

function setSelection(selected: string, key: string) {
  if (keyExists(key)) {
    (jobApplication.value as any)[key] = selected
    jobApplicationValidation.value[key] = true
  }
}


</script>

<template>
    <div class="job-card border p-3 m-3 rounded shadow-sm">

        <div v-for="(value,key) in jobApplication">
            <div 
                v-if="key === 'status' || key === 'workArrangement' || key === 'salaryType'"
                class="mt-4 mb-4"    
            >
                <h4>{{ upper(key) }}</h4>
                <Radio 
                    :name="key" 
                    :structure="JobFields[key]" 
                    :items="JobFields[key]" 
                    @radio-selected="(selectedItem) => setSelection(selectedItem, key)"
                />
            </div>
            <div 
                v-else-if="key === 'type'"
                class="mt-4 mb-4"    
            >
                <h4>{{ upper(key) }}</h4>
                <Radio 
                    :name="key" 
                    :structure="JobFields.workType" 
                    :items="JobFields.workType" 
                    @radio-selected="(selectedItem) => setSelection(selectedItem, key)"
                />
            </div>
            <div 
                v-else-if="key === 'dateApplied'"
                class="mt-4 mb-4"    
            >
                <h4>{{ upper(key) }}</h4>
                <DatePicker 
                    mode="add"
                    @date-selected="(textInput) => setText(textInput, key)"
                    @date-rejected="resetText(key)"    
                />
            </div>
            <div 
                v-else-if="key === 'salary'"
                class="mt-4 mb-4"    
            >
                <h4>{{ upper(key) }}</h4>
                <div class="d-flex align-items-center">
                    <p class="m-2">$</p><Number 
                        mode="add" 
                        @text-number-provided="(textInput) => setText(textInput, key)" 
                        @text-number-rejected="resetText(key)"
                    />
                </div>
            </div>
            <div v-else-if="key === '_id' || key === 'customFields'"></div>

            <!-- text inputs that do not depend on set values -->
            <div 
                v-else
                class="mt-4 mb-4"    
            >
                <h4>{{ upper(key) }}</h4>
                <Text
                    mode="add"
                    @text-provided="(textInput) => setText(textInput, key)" 
                    @text-rejected="resetText(key)"
                    :required="true"
                />
            </div>
        </div>

        <h3 class="mt-3">Custom Fields</h3>
        <div class="mt-3 mb-3" v-for="customField in jobApplication.customFields">
          <h4>{{ customField.key }}</h4>
          {{ customField.content }}
        </div>

        <!-- triggering allowing for custom fields -->
        <button class="btn btn-primary m-3" @click="creatingCustomFields = true">+ field</button>

        <!-- creating custom fields -->
        <div
            id="custom-fields"
            class="mt-5"
            v-if="creatingCustomFields"
        >
            <Custom 
                ref="customFieldRef" 
                @custom-field="(newCustomField) => addCustomField(newCustomField)"
            />
        </div>


        
        <div class="pt-4">
            <div v-if="errorMessage.invalidInputs.active" >
                {{ errorMessage.invalidInputs.message }}
            </div>
            <button @click="pushJob" class="btn btn-primary m-3">save</button>
            <button @click="emit('cancel-job-add')" class="btn btn-danger m-3">cancel</button>
            <button @click="console.log(jobApplicationValidation)">test</button>
        </div>
    </div>
</template>
