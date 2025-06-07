<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { salaryType, type Jobs, status, workArrangement, workType } from '../../../../server/types/Jobs.ts'
import apiClient from '../../api/axios.ts'
import { upper, validateInput } from '../../utilities/helpers.ts'

const dummyJob: Ref<Jobs> = ref({
    role: '',
    company: '',
    dateApplied: '',
    status: status.applied,
    notes: '',
    location: '',
    workArrangement: workArrangement.hybrid,
    link: '',
    type: workType.fullTime,
    salaryType: salaryType.yearly,
    salary: ''
})

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

const helperText: Record<string, string> = {
    role: "Role name (i.e. \"Software Engineer\")",
    notes: "(Optional) any notes you want to add",
    link: "(Optional) reference link (i.e. job posting)",
    location: "(Optional)"
}

const emit = defineEmits(['job-added', 'cancel-job-add'])

async function pushJob() {
    let push = true
    Object.values(dummyValidation.value).forEach(validation => {
        if (validation === false) {
            console.log("ERROR: Cannot push job, invalid field provided.", dummyValidation)
            push = false
            return
        }
    });

    if(push){
        try {
            const response = await apiClient.post('/createJob', dummyJob.value);
            emit('job-added')
            console.log("SUCCESS: Posted job", response)
        } catch(error){
            console.log("ERROR: Could not post job.", error);
        }      
    }

}

</script>

<template>
    <div class="job-card border p-3 m-3 rounded shadow-sm">
        <div v-for="(value, key) in dummyJob" :key="key" class="p-2 mt-3">
            <p>{{ upper(key) }}</p>
            <div v-if="key === 'dateApplied'">
                <input 
                    @input="dummyValidation[key] = validateInput(key, dummyJob[key])" 
                    @blur="dummyValidation[key] = validateInput(key, dummyJob[key])" 
                    type="date" 
                    :class="{
                        'form-control w-100 rounded is-valid': dummyValidation[key] === true,
                        'form-control w-100 rounded is-invalid': dummyValidation[key] === false
                    }"  
                    v-model="dummyJob[key]" 
                    :placeholder="upper(key)" 
                    required
                >
            </div>
            <div v-else-if="key === 'workArrangement'">
                <div class="form-check">
                    <div v-for="item in workArrangement">
                        <input 
                            @input="dummyValidation[key] = validateInput(key, dummyJob[key])" 
                            @blur="dummyValidation[key] = validateInput(key, dummyJob[key])"
                            :class="{
                                'form-check-input is-valid': dummyValidation[key] === true,
                                'form-check-input is-invalid': dummyValidation[key] === false
                            }"   
                            name="radioGroupWorkArrangement" 
                            type="radio" 
                            :value="upper(item)"
                        >
                        <label>{{ upper(item) }}</label>
                    </div>
                </div>
            </div>
            <div v-else-if="key === 'status'">
                <div class="form-check">
                    <div v-for="item in status">
                        <input 
                            @input="dummyValidation[key] = validateInput(key, dummyJob[key])" 
                            @blur="dummyValidation[key] = validateInput(key, dummyJob[key])"
                            :class="{
                                'form-check-input is-valid': dummyValidation[key] === true,
                                'form-check-input is-invalid': dummyValidation[key] === false
                            }"   
                            name="radioGroupWorkArrangement" 
                            type="radio" 
                            :value="upper(item)"
                        >
                        <label>{{ upper(item) }}</label>
                    </div>
                </div>
            </div>
            <div v-else-if="key === 'type'">
                <div class="form-check">
                    <div v-for="item in workType">
                        <input 
                            @input="dummyValidation[key] = validateInput(key, dummyJob[key])" 
                            @blur="dummyValidation[key] = validateInput(key, dummyJob[key])" 
                            :class="{
                                'form-check-input is-valid': dummyValidation[key] === true,
                                'form-check-input is-invalid': dummyValidation[key] === false
                            }"    
                            name="radioGroupWorkType" 
                            type="radio" 
                            :value="upper(item)"
                        >
                        <label>{{ upper(item) }}</label>
                    </div>
                </div>
            </div>
            <div v-else-if="key === 'salaryType'">
                <div class="form-check">
                    <div v-for="item in salaryType">
                        <input 
                            @input="dummyValidation[key] = validateInput(key, dummyJob[key])" 
                            @blur="dummyValidation[key] = validateInput(key, dummyJob[key])" 
                            :class="{
                                'form-check-input is-valid': dummyValidation[key] === true,
                                'form-check-input is-invalid': dummyValidation[key] === false
                            }"   
                            name="radioGroupSalaryType" 
                            type="radio" 
                            :value="upper(item)"
                        >
                        <label>{{ upper(item) }}</label>
                    </div>
                </div>
            </div>
            <div v-else>
                <input 
                    @input="dummyValidation[key] = validateInput(key, dummyJob[key])" 
                    @blur="dummyValidation[key] = validateInput(key, dummyJob[key])" 
                    type="text" 
                    :class="{
                        'form-control w-100 p-1 rounded is-valid': dummyValidation[key] === true,
                        'form-control w-100 p-1 rounded is-invalid': dummyValidation[key] === false
                    }" 
                    v-model="dummyJob[key]" 
                    :placeholder="upper(key)" 
                    required
                >
                <small class="form-text text-muted">{{ helperText[key] }}</small>
            </div>
        </div>
    </div>
    <button @click="pushJob" class="btn btn-primary m-3">save</button>
    <button @click="emit('cancel-job-add')" class="btn btn-danger m-3">cancel</button>
</template>