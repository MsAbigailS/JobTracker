<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    type: string
    placeholder?: string
    required?: boolean
    validate?: (input: string) => boolean
    mode?: 'edit' | 'add'
}>()

const value = ref('')
const placeholder = ref(props.placeholder ?? '')

const emit = defineEmits<{
    (e: 'text-provided', textInput: string): void,
    (e: 'text-rejected'): void
}>()

function handleBlur(){
    if (props.validate && props.required == true) {
        if(props.validate(value.value)){
            // placeholder.value = '' // causes placeholder to render empty
            emit('text-provided', value.value as string)
        } else {
            if(value.value.length === 0 && props.mode === 'edit'){
                emit('text-rejected')
                console.log("EDIT mode with empty input")
            } else {
                emit('text-rejected')
                console.log("ERROR: Input invalid.",value.value as string)
            }
        }
    }
}

function handleChange(){
    if(props.validate){
        if(props.validate(value.value)){
            emit('text-provided', value.value)
        }
    }
}

</script>

<template>
    <input
        class="form-control"
        :type="type"
        :placeholder="placeholder"
        v-model="value"
        :required="required"
        @blur="handleBlur"
        @change="handleChange"
    />
</template>