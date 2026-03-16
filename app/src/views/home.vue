<template>
    <div>
        <h1 v-for="guy in trials" :key="guy.docket_id">{{ guy.intake_max_severity }}</h1>
    </div>
</template>

<script setup>
import { onMounted,ref } from 'vue'
    const trials = ref([])
    async function getdata() {
        try{
        const res = await fetch("https://data.cityofnewyork.us/resource/atne-2dki.json")
        const data = await res.json()
        trials.value = data
        } catch(err) {
            console.log(err)
        }
    }
    onMounted(function(){
        getdata()
    })
</script>

<style scoped>

</style>