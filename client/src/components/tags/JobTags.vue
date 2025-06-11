<script setup lang="ts">

const props = defineProps < {
    status: String
}>()

</script>

<template>
    <div 
        class="border rounded shadow-sm d-flex align-items-center"
    >
        <div
            :class="{
                'rounded-circle m-2 border bg-primary': status === 'applied',
                'rounded-circle m-2 border bg-warning': status === 'interviewing',
                'rounded-circle m-2 border bg-success': status === 'offer',
                'rounded-circle m-2 border bg-secondary': status === 'rejected'
            }"
            style="width: 15px; height: 15px"
        >
        </div>
        <div class="me-2">{{ props.status }}</div>
    </div>
</template>