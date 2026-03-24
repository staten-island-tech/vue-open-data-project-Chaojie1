<template>
  <div ref="chartcon"></div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import * as d3 from 'd3'
const data = ref([])
async function getdata() {
  try {
    const res = await fetch('https://data.cityofnewyork.us/resource/vq35-j9qm.json')
    const a = await res.json()
    const dat = []
    for (let i=0;i<a.length;i++){
        
        if (dat.find((x)=>x.type===a[i].facility_type)){
            
            dat.find((x)=>x.type===a[i].facility_type).amount += Number(a[i].acm_amount)
        } else{
            console.log(a[i])
            dat.push({type:a[i].facility_type,amount:Number(a[i].acm_amount)})
        }
    }
    data.value = dat
  } catch (err) {
    console.log(err)
  }
}
const chartcon = ref(null)
onMounted(async () => {
  await getdata()

  const width = 500
  const height = 500
  const radius = Math.min(width, height) / 2

  const svg = d3
    .select(chartcon.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  const color = d3.scaleOrdinal(d3.schemeTableau10)

  const pie = d3.pie().value((d) => Number(d.amount))

  const arc = d3.arc().innerRadius(0).outerRadius(radius)

  const arcs = svg.selectAll('arc').data(pie(data.value)).enter().append('g')
  arcs
    .append('path')
    .attr('d', arc)
    .attr('fill', (d) => color(d.data.type))
    .attr('stroke', 'white')
    .style('stroke-width', '2px')

  const labelArc = d3
    .arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius * 0.6)

  arcs
    .append('text')
    .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .attr('font-size', '11px')
    .text((d) => d.data.type+": "+d.data.amount)
})
</script>

<style scoped></style>
