<script setup lang="ts">
import Input from '../Input.vue'
import {formatEnum} from '../../../utilities/helpers.ts'

const props = defineProps<{
    input?: string
    required?: boolean
    name?:string
    items?: {} | string[]
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
        <div class="mt-1" v-if="formatEnum(input ?? '') === key || formatEnum(input ?? '') === label">
            <input 
                type="radio"
                :name="name ?? nameDefault"
                :value="label"
                @change="emit('radio-selected',label)"
                checked
            />
            <label class="p-1">{{label}}</label>
        </div>
        <div class="mt-1" v-else>
            <input 
                type="radio"
                :name="name ?? nameDefault"
                :value="label"
                @change="emit('radio-selected',label)"
            />
            <label class="p-1">{{label}}</label>
        </div>
    </div>
    
</template>