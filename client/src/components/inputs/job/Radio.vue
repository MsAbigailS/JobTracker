<script setup lang="ts">
import Input from '../Input.vue'
import {formatEnum} from '../../../utilities/helpers.ts'

const props = defineProps<{
    input?: string
    required?: boolean
    name?:string
    items?: {}
    structure?: any
}>()

const nameDefault = 'defaultRadioGroup'

const emit = defineEmits<{
    (e: 'radio-selected', selectedItem: string):void
}>()

if(!props.name){
    console.log(`WARNING: Radio group name not provided. Defaulting to ${nameDefault}.`)
}

</script>

<template>

    <div v-for="(label, key) in items" :key="key">
        <div v-if="formatEnum(input ?? '') === key">
            <input 
                type="radio"
                :name="name ?? nameDefault"
                :value="label"
                @change="emit('radio-selected',label)"
                checked
            />
            <label>{{label}}</label>
        </div>
        <div v-else>
            <input 
                type="radio"
                :name="name ?? nameDefault"
                :value="label"
                @change="emit('radio-selected',label)"
            />
            <label>{{label}}</label>
        </div>
    </div>
    
</template>