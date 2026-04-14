<template>
  <div style="padding: 1rem;">
    <div v-if="loading" style="color: gray; font-size: 14px;">Loading data…</div>
    <div v-if="error" style="color: red; font-size: 14px;">{{ error }}</div>

    <div v-if="!loading && !error">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
        <div>
          <label style="font-size: 12px; color: gray; display: block; margin-bottom: 6px;">Case A</label>
          <select v-model="caseA" style="width: 100%; padding: 6px 8px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px;">
            <option v-for="d in allData" :key="d.type" :value="d.type">{{ d.type }}</option>
          </select>
        </div>
        <div>
          <label style="font-size: 12px; color: gray; display: block; margin-bottom: 6px;">Case B</label>
          <select v-model="caseB" style="width: 100%; padding: 6px 8px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px;">
            <option v-for="d in allData" :key="d.type" :value="d.type">{{ d.type }}</option>
          </select>
        </div>
      </div>

      <div v-if="caseAData && caseBData" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
        <div v-for="(c, idx) in [caseAData, caseBData]" :key="c.type"
          :style="{ background: idx === 0 ? '#EBF4FF' : '#FFF3E8', borderRadius: '10px', padding: '16px' }">
          <p style="font-size: 12px; color: gray; margin: 0 0 2px;">{{ idx === 0 ? 'Case A' : 'Case B' }}</p>
          <p style="font-size: 15px; font-weight: 500; margin: 0 0 12px;">{{ c.type }}</p>
          <p style="font-size: 28px; font-weight: 600; margin: 0 0 4px;" :style="{ color: idx === 0 ? '#185FA5' : '#993C1D' }">{{ fmt(c.amount) }}</p>
          <p style="font-size: 12px; color: gray; margin: 0;">{{ ((c.amount / grandTotal) * 100).toFixed(1) }}% of total</p>
        </div>
      </div>

      <svg ref="barRef" style="width: 100%; display: block;"></svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import * as d3 from 'd3'

const allData = ref([])
const loading = ref(true)
const error = ref(null)
const barRef = ref(null)
const caseA = ref(null)
const caseB = ref(null)

const grandTotal = computed(() => d3.sum(allData.value, d => d.amount))
const caseAData = computed(() => allData.value.find(d => d.type === caseA.value))
const caseBData = computed(() => allData.value.find(d => d.type === caseB.value))

function fmt(v) {
  if (v >= 1e9) return '$' + (v / 1e9).toFixed(1) + 'B'
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M'
  if (v >= 1e3) return '$' + (v / 1e3).toFixed(0) + 'K'
  return '$' + Math.round(v)
}

async function fetchData() {
  try {
    const res = await fetch('https://data.cityofnewyork.us/resource/vq35-j9qm.json')
    const raw = await res.json()
    const map = {}
    for (const row of raw) {
      const t = row.facility_type || 'Unknown'
      map[t] = (map[t] || 0) + Number(row.acm_amount || 0)
    }
    allData.value = Object.entries(map)
      .map(([type, amount]) => ({ type, amount }))
      .sort((a, b) => b.amount - a.amount)
    caseA.value = allData.value[0]?.type
    caseB.value = allData.value[1]?.type
  } catch (e) {
    error.value = 'Failed to load data: ' + e.message
  } finally {
    loading.value = false
  }
}

function drawBar() {
  const svgEl = barRef.value
  if (!svgEl || !caseAData.value || !caseBData.value) return

  d3.select(svgEl).selectAll('*').remove()

  const cases = [
    { ...caseAData.value, color: '#378ADD', label: 'Case A' },
    { ...caseBData.value, color: '#D85A30', label: 'Case B' }
  ]

  const W = svgEl.getBoundingClientRect().width || 500
  const margin = { top: 20, right: 20, bottom: 48, left: 72 }
  const H = 180
  const innerW = W - margin.left - margin.right
  const innerH = H - margin.top - margin.bottom

  const svg = d3.select(svgEl).attr('viewBox', `0 0 ${W} ${H}`).attr('height', H)
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const x = d3.scaleBand().domain(cases.map(d => d.label)).range([0, innerW]).padding(0.45)
  const y = d3.scaleLinear().domain([0, d3.max(cases, d => d.amount)]).nice().range([innerH, 0])

  g.append('g').attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).tickSize(0))
    .call(ax => ax.select('.domain').remove())
    .selectAll('text').attr('font-size', '13px').attr('fill', 'gray')

  g.append('g')
    .call(d3.axisLeft(y).ticks(4).tickFormat(fmt))
    .call(ax => ax.select('.domain').remove())
    .call(ax => ax.selectAll('.tick line').attr('stroke', '#eee').attr('x2', innerW))
    .selectAll('text').attr('font-size', '11px').attr('fill', 'gray')

  g.selectAll('rect').data(cases).join('rect')
    .attr('x', d => x(d.label))
    .attr('y', d => y(d.amount))
    .attr('width', x.bandwidth())
    .attr('height', d => innerH - y(d.amount))
    .attr('fill', d => d.color)
    .attr('rx', 4)

  g.selectAll('.val-label').data(cases).join('text')
    .attr('class', 'val-label')
    .attr('x', d => x(d.label) + x.bandwidth() / 2)
    .attr('y', d => y(d.amount) - 6)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', '500')
    .attr('fill', d => d.color)
    .text(d => fmt(d.amount))

  const diff = caseAData.value.amount - caseBData.value.amount
  const sign = diff >= 0 ? '+' : ''
  g.append('text')
    .attr('x', innerW / 2)
    .attr('y', innerH + 38)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('fill', diff >= 0 ? '#185FA5' : '#993C1D')
    .text(`Case A is ${sign}${fmt(Math.abs(diff))} (${sign}${(((caseAData.value.amount / caseBData.value.amount) - 1) * 100).toFixed(1)}%) vs Case B`)
}

watch([caseA, caseB], async () => {
  await nextTick()
  drawBar()
})

onMounted(async () => {
  await fetchData()
  await nextTick()
  drawBar()
})
</script>