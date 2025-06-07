<script setup lang="ts">
import { salaryType, type Jobs } from '../../../../server/types/Jobs.ts'
import { upper, dateToString, abbrevSalaryType, numberToMoney } from '../../utilities/helpers.ts'

const props = defineProps<{
    jobs: Jobs[]
}>()

const fields = [
    { label: 'role' as keyof Jobs },
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

</script>

<template>
    <div class="border rounded shadow-sm p-3 m-3">
        <table class="table">
            <tbody>
                <tr>
                    <th v-for="field in fields">
                        <td v-if="field.label != 'salaryType' && field.label != 'notes'">{{ upper(field.label) }}</td>
                    </th>
                </tr>
                <tr v-for="job in jobs">
                    <td v-for="field in fields">
                        <span v-if="field.label == 'dateApplied'">{{ dateToString(job[field.label]) ?? ''}}</span>
                        <span v-else-if="field.label == 'salary'">${{ numberToMoney(job[field.label]) }}/{{ abbrevSalaryType(job.salaryType) ?? ''}}</span>
                        <span v-else-if="field.label == 'salaryType' || field.label == 'notes'"></span>
                        <span v-else>{{ job[field.label]}}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>