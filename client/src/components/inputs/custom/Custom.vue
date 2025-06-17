<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { CustomFields } from '../../../../../server/types/Jobs'
import Text from '../job/Text.vue'
import Number from '../job/Number.vue'
import DatePicker from '../job/DatePicker.vue'
import Radio from '../job/Radio.vue'

// allowing for reset from parent
defineExpose({
    resetCustomField
})

// user created custom field
const newCustomField = ref<CustomFields>({
    key: '',
    type: 'text',
    options: null, // radio options
    content: '' // value (radio will have selected value)
})

// used for splitting radio options
const optionsInput = ref('')

// emitting up values
const emit = defineEmits<{
    (e: 'custom-field', customField: CustomFields):void
}>()

// splitting apart for radio
watch(optionsInput, (newOptions) => {
    newCustomField.value.options = newOptions.split(",").map(option => option.trim()).filter(option => option !== '')
})

// checking if valid input, then setting and resetting
function setCustomField() {
    if (newCustomField.value.content.length > 0 && newCustomField.value.key.length > 0) {
        emit('custom-field', newCustomField.value)
    } else {
        console.log("WARNING: Cannot set custom field due to key or value length being too short.")
    }
}

// resetting custom field inputs
function resetCustomField() {
    console.log("Resetting custom field")
    newCustomField.value.content = ''
    newCustomField.value.key = ''
    newCustomField.value.options = null
    newCustomField.value.type = 'text'
}

</script>

<template>
    <div>
        <div class="mt-4">
            <!-- custom input key and type -->
            <div id="custom-input">
                <!-- getting type -->
                <select class="form-select" id="custom-input-type-selection" v-model="newCustomField.type">
                    <option value="text">text</option>
                    <option value="number">number</option>
                    <option value="date">date</option>
                    <option value="radio">radio</option>
                </select>

                <!-- key -->
                <p class="mt-3">Field name</p>
                <input 
                    id="custom-input-key"
                    class="form-control rounded"
                    type="text" 
                    v-model="newCustomField.key" 
                    placeholder="field name"
                />

                <p class="mt-3">Value</p>
                <!-- handling radio input -->
                <div v-if="newCustomField.type === 'radio'">
                    <input class="form-control rounded" v-model="optionsInput" placeholder="comma-separated options"/>
                </div>

                <!-- custom input value(s) -->
                
                <div class="mt-3" id="custom-input-value" v-if="newCustomField.key.length > 0"> <!-- only showing if key given to input -->
                    <Text
                        v-if="newCustomField.type === 'text'"
                        mode="add"
                        :required=false
                        @text-provided="(textInput) => newCustomField.content = textInput"
                    />

                    <Number
                        v-if="newCustomField.type === 'number'"
                        mode="add"
                        :required=false
                        @text-number-provided="(numberInput) => newCustomField.content = numberInput"
                    />

                    <DatePicker
                        v-if="newCustomField.type === 'date'"
                        mode="add"
                        :allowFuture="true"
                        @date-selected="(date) => newCustomField.content = date"

                    />

                    <Radio
                        v-if="newCustomField.type === 'radio'"
                        mode="add"
                        :items="newCustomField.options ?? undefined"
                        @radio-selected="(val) => newCustomField.content = val"
                    />
                </div>
            </div>

            <button class="btn btn-primary m-3" @click="setCustomField">save custom field</button>

        </div>
    </div>
</template>