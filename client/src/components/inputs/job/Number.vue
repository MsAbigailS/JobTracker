<script setup lang="ts">
import { ref } from 'vue'
import { validateNumberTextInput } from '../../../utilities/helpers.ts'
import Input from '../Input.vue'

const props = defineProps<{
    input?: string // provided will be placeholder
    required?: boolean
    mode: 'edit' | 'add'
}>()

const validation = ref()

if(props.mode === 'edit'){
    validation.value = true
}

const currInput = ref('')

const emit = defineEmits<{
    (e: 'text-number-provided', textInput: string): void,
    (e: 'text-number-rejected'):void
}>()

function validate(textInput: string){
    return validation.value = validateNumberTextInput(textInput)
}

function bubble(textInput: string, validated: boolean){
    if(validated){
        emit('text-number-provided', textInput)
    } else {
        if(props.mode === 'edit' && currInput.value.length === 0){
            validation.value = true
            emit('text-number-rejected')
        } else {
            emit('text-number-rejected')
        }
    }
}
</script>

<template>
    <Input
        type="text"
        :placeholder="input"
        :required="required"
        :validate="validate"
        :mode="mode"
        v-model="currInput"
        @text-provided="(textInput) => bubble(textInput, true)"
        @text-rejected="bubble('', false)"
        :class="{
            'form-control rounded is-valid': validation === true,
            'form-control rounded is-invalid': validation === false
        }"
    />
</template>