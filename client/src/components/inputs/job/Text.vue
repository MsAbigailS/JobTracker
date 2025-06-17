<script setup lang="ts">
import { ref } from 'vue'
import { validateInputText } from '../../../utilities/helpers.ts'
import Input from '../Input.vue'

const props = defineProps<{
    input?: string // provided will be placeholder
    required: boolean
    mode: 'edit' | 'add'
}>()

const validation = ref()

if(props.mode === 'edit'){
    validation.value = true
}

const emit = defineEmits<{
    (e: 'text-provided', textInput: string): void,
    (e: 'text-rejected'):void
}>()

function validate(textInput: string): boolean{
    if (!props.required) {
        return true
    } else {
        return validation.value = validateInputText(textInput)
    }
}

function bubble(textInput: string, validated: boolean){
    if(validated){
        emit('text-provided', textInput)
    } else {
        if(props.mode === 'edit'){
            validation.value = true
            emit('text-rejected')
        } else {
            emit('text-rejected')
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
        @text-provided="(textInput) => bubble(textInput, true)"
        @text-rejected="bubble('', false)"
        :class="{
            'form-control rounded is-valid': validation === true,
            'form-control rounded is-invalid': validation === false,
            'form-control rounded': validation === null
        }"
    />
</template>