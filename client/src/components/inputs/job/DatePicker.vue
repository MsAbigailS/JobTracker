<script setup lang="ts">
import { ref } from 'vue'
import { validateInputDate } from '../../../utilities/helpers.ts'
import Input from '../Input.vue'


const props = defineProps<{
    date?: string
    mode: 'edit' | 'add'
}>()

const validation = ref(true)
const selectedDate = ref(props?.date ?? '')

const emit = defineEmits<{
    (e: 'date-selected', date: string): void,
    (e: 'date-rejected'):void
}>()

function validate(){
    if (typeof selectedDate.value === 'string') {
        validation.value = validateInputDate(selectedDate.value)
        if(validation.value){
            emit('date-selected', selectedDate.value)
        } else {
            emit('date-rejected')
            console.log('ERROR: Unable to validate date input.')
        }
    } else {
        emit('date-rejected')
        console.log("ERROR: Unable to validate date input.")
    }
}

</script>

<template>
    <input 
        type="date" 
        v-model="selectedDate"
        class="form-control" 
        @input="validate"
        @blur="validate"
        :class="{
            'form-control rounded is-valid': validation === true,
            'form-control rounded is-invalid': validation === false
        }" 
    />
</template>
