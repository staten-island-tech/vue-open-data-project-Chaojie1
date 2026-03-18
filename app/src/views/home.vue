<template>
    <div>
        <h1>Could You Survive This Much Asbestos?</h1>
        <h1 v-for="asb in estos" :key="asb.tru">{{ asb.tru }} has {{ asb.acm_amount }} asbestos</h1>
    </div>
</template>

<script setup>
import { onBeforeMount, onMounted,ref } from 'vue'
    const estos = ref([])
    async function getdata() {
        try{
        const res = await fetch("https://data.cityofnewyork.us/resource/vq35-j9qm.json")
        const data = await res.json()
        estos.value = data
        } catch(err) {
            console.log(err)
        }
    }
    onBeforeMount(function(){
        getdata()
    })
</script>

<style scoped>

</style>