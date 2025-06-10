<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { upper, dateToString, abbrevSalaryType, numberToMoney, validateInput } from '../../utilities/helpers.ts'
import { salaryType, type Jobs, status, workArrangement, workType } from '../../../../server/types/Jobs.ts'
import apiClient from '../../api/axios.ts'

const props = defineProps<{
    job?: Jobs
}>();

const dummyJob: Ref<Jobs> = ref({
    _id: props.job?._id ?? '',
    role: props.job?.role ?? '',
    company: props.job?.company ?? '',
    dateApplied: props.job?.dateApplied ?? '',
    status: props.job?.status ?? status.applied,
    notes: props.job?.notes ?? '',
    location: props.job?.location ?? '',
    workArrangement: props.job?.workArrangement ?? workArrangement.hybrid,
    link: props.job?.link ?? '',
    type: props.job?.type ?? workType.fullTime,
    salaryType: props.job?.salaryType ?? salaryType.yearly,
    salary: props.job?.salary ?? ''
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
            console.log(dummyJob.value._id)
            await apiClient.patch('updateJob/' + dummyJob.value._id, dummyJob.value)
            emit('job-updated')
            console.log("SUCCESS: Updated job")
        } catch (err) {
            console.log("ERROR: Could not update job",err)
        }
    }
}
</script>

<template>
      <div class="job-card-full border p-4 mt-3 mb-3 rounded shadow-sm bg-white">
        <div id="header" class="card-title d-flex flex-column justify-content-between">
            <h2>{{ job?.role }}</h2>
            <div>{{ job?.status }}</div>
        </div>

    <div id="body" class="card-body">
      <div v-for="(fields) in fields" class="pb-2 pt-2">
        <div style="width:40%">{{ upper(fields.label ?? '') }}</div>
        <div v-if="fields.label == 'dateApplied'">
            <input 
                @input="dummyValidation[fields.label] = validateInput(fields.label, dummyJob[fields.label])" 
                @blur="dummyValidation[fields.label] = validateInput(fields.label, dummyJob[fields.label])" 
                type="date" 
                :class="{
                    'form-control w-100 rounded is-valid': dummyValidation[fields.label] === true,
                    'form-control w-100 rounded is-invalid': dummyValidation[fields.label] === false
                }"  
                v-model="dummyJob[fields.label]" 
                :placeholder="dummyJob[fields.label]" 
                required
            >
        </div>
        <div v-else-if="fields.label == 'salary'" style="width:60%; display: flex; align-items: baseline;">
            $<input  
                style="width:60%" 
                @blur="dummyValidation[fields.label as keyof Jobs] = validateInput(fields.label as keyof Jobs, dummyJob[fields.label as keyof Jobs])"
                @input="dummyValidation[fields.label as keyof Jobs] = validateInput(fields.label as keyof Jobs, dummyJob[fields.label as keyof Jobs])" 
                v-model="dummyJob[fields.label as keyof Jobs]" 
                :value="dummyJob[fields.label as keyof Jobs]"
                :class="{
                        'form-control w-100 rounded is-valid': dummyValidation[fields.label as keyof Jobs] === true,
                        'form-control w-100 rounded is-invalid': dummyValidation[fields.label as keyof Jobs] === false
                    }" 
            />
        </div>
        
        <div v-else-if="fields.label === 'workArrangement'">
                <div class="form-check">
                    <div v-for="item in workArrangement">
                        <div v-if="item == dummyJob.workArrangement">
                            <input 
                                @input="dummyValidation[fields.label] = validateInput(fields.label, dummyJob[fields.label])" 
                                @blur="dummyValidation[fields.label] = validateInput(fields.label, dummyJob[fields.label])"
                                :class="{
                                    'form-check-input is-valid': dummyValidation[fields.label] === true,
                                    'form-check-input is-invalid': dummyValidation[fields.label] === false
                                }"   
                                name="radioGroupWorkArrangement" 
                                type="radio" 
                                :value="upper(item)"
                                checked
                            >
                            <label>{{ upper(item) }}</label>
                        </div>
                        <div v-else>
                            <input 
                                @input="dummyValidation[fields.label] = validateInput(fields.label, dummyJob[fields.label])" 
                                @blur="dummyValidation[fields.label] = validateInput(fields.label, dummyJob[fields.label])"
                                :class="{
                                    'form-check-input is-valid': dummyValidation[fields.label] === true,
                                    'form-check-input is-invalid': dummyValidation[fields.label] === false
                                }"   
                                name="radioGroupWorkArrangement" 
                                type="radio" 
                                :value="upper(item)"
                            >
                            <label>{{ upper(item) }}</label>
                        </div>
                    </div>
                </div>   
        </div>

        <div v-else-if="fields.label === 'type'">
            <div class="form-check">
                <div v-for="item in workType">
                    <div v-if="item == dummyJob.type">
                        <input 
                            @input="dummyValidation[fields.label] = validateInput(fields.label, dummyJob[fields.label])" 
                            @blur="dummyValidation[fields.label] = validateInput(fields.label, dummyJob[fields.label])"
                            :class="{
                                'form-check-input is-valid': dummyValidation[fields.label] === true,
                                'form-check-input is-invalid': dummyValidation[fields.label] === false
                            }"   
                            name="radioGroupWorkType" 
                            type="radio" 
                            :value="upper(item)"
                            checked
                        >
                        <label>{{ upper(item) }}</label>
                    </div>
                    <div v-else>
                        <input 
                            @input="dummyValidation[fields.label] = validateInput(fields.label, dummyJob[fields.label])" 
                            @blur="dummyValidation[fields.label] = validateInput(fields.label, dummyJob[fields.label])"
                            :class="{
                                'form-check-input is-valid': dummyValidation[fields.label] === true,
                                'form-check-input is-invalid': dummyValidation[fields.label] === false
                            }"   
                            name="radioGroupWorkType" 
                            type="radio" 
                            :value="upper(item)"
                        >
                        <label>{{ upper(item) }}</label>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="fields.label === 'salaryType'">
            <div class="form-check">
                <div v-for="item in salaryType">
                    <div v-if="item == dummyJob.salaryType">
                        <input 
                            @input="dummyValidation[fields.label] = validateInput(fields.label, dummyJob[fields.label])" 
                            @blur="dummyValidation[fields.label] = validateInput(fields.label, dummyJob[fields.label])"
                            :class="{
                                'form-check-input is-valid': dummyValidation[fields.label] === true,
                                'form-check-input is-invalid': dummyValidation[fields.label] === false
                            }"   
                            name="radioGroupSalaryType" 
                            type="radio" 
                            :value="upper(item)"
                            checked
                        >
                        <label>{{ upper(item) }}</label>
                    </div>
                    <div v-else>
                        <input 
                            @input="dummyValidation[fields.label] = validateInput(fields.label, dummyJob[fields.label])" 
                            @blur="dummyValidation[fields.label] = validateInput(fields.label, dummyJob[fields.label])"
                            :class="{
                                'form-check-input is-valid': dummyValidation[fields.label] === true,
                                'form-check-input is-invalid': dummyValidation[fields.label] === false
                            }"   
                            name="radioGroupSalaryType" 
                            type="radio" 
                            :value="upper(item)"
                        >
                        <label>{{ upper(item) }}</label>
                    </div>
                </div>
            </div>
        </div>

        <div v-else style="width:60%">
            <input  
                style="width:60%" 
                @blur="dummyValidation[fields.label as keyof Jobs] = validateInput(fields.label as keyof Jobs, dummyJob[fields.label as keyof Jobs])"
                @input="dummyValidation[fields.label as keyof Jobs] = validateInput(fields.label as keyof Jobs, dummyJob[fields.label as keyof Jobs])" 
                v-model="dummyJob[fields.label as keyof Jobs]" 
                :value="dummyJob[fields.label as keyof Jobs]"
                :class="{
                        'form-control w-100 rounded is-valid': dummyValidation[fields.label as keyof Jobs] === true,
                        'form-control w-100 rounded is-invalid': dummyValidation[fields.label as keyof Jobs] === false
                    }" 
            />
        </div>
      </div>
    </div>
    <div class="d-flex flex-row">
        <button @click="updateJob" class="btn btn-primary m-3">save</button>
        <button @click="emit('job-updated')" class="btn btn-danger m-3">cancel</button>
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
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1.5rem;
  box-sizing: border-box;
}
</style>