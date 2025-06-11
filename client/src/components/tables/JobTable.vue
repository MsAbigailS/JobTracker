<script setup lang="ts">
import { salaryType, type Jobs } from '../../../../server/types/Jobs.ts'
import { upper, dateToString, abbrevSalaryType, numberToMoney } from '../../utilities/helpers.ts'
import JobTags from '../tags/JobTags.vue'

const props = defineProps<{
    jobs: Jobs[]
}>()

const emit = defineEmits<{
  (e: 'show-full-job-card', id: string): void
}>()

const fields = [
    { label: 'role' as keyof Jobs },
    { label: 'company' as keyof Jobs },
    { label: 'status' as keyof Jobs},
    { label: 'dateApplied' as keyof Jobs },
    { label: 'notes' as keyof Jobs},
    { label: 'location' as keyof Jobs },
    { label: 'workArrangement' as keyof Jobs },
    { label: 'salaryType' as keyof Jobs},
    { label: 'type' as keyof Jobs }
]

</script>

<template>
    <div class="border rounded shadow-sm p-3 m-3">
        <table class="table table-hover">
            <tbody>
                <tr>
                    <th v-for="field in fields" class="text-center">
                        <th v-if="field.label != 'salaryType' && field.label != 'notes' && field.label != 'workArrangement' && field.label != 'location'" class="container-fluid">{{ upper(field.label) }}</th>
                        <th v-else-if="field.label == 'workArrangement'" class="container-fluid">Style</th>
                    </th>
                </tr>
                <tr v-for="job in jobs" class="job" @click="emit('show-full-job-card', job._id)">
                    <td v-for="field in fields">
                        <span v-if="field.label == 'dateApplied'" class="container-fluid text-center">{{ dateToString(job[field.label]) ?? ''}}</span>
                        <span v-else-if="field.label == 'salary'">${{ numberToMoney(job[field.label]) }}/{{ abbrevSalaryType(job.salaryType) ?? ''}}</span>
                        <span v-else-if="field.label == 'salaryType' || field.label == 'notes' || field.label == 'location'"></span>
                        <span v-else-if="field.label == 'status'" class="d-flex"><JobTags :status="job?.status ?? ''"/></span>
                        <span v-else-if="field.label == 'workArrangement'" class="container-fluid text-center">{{job?.workArrangement}}</span>
                        <span v-else>{{ job[field.label]}}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style>
.job:hover{
    background-color:red !important;
}
</style>