const COMPARISONS = [
  { item: 'hours of consultant time', unitCost: 175 },
  { item: 'days of contractor pay', unitCost: 600 },
  { item: 'enterprise software licenses per month', unitCost: 75 },
  { item: 'training course seats', unitCost: 750 },
  { item: 'conference registrations', unitCost: 1200 },
  { item: 'laptop replacements', unitCost: 1200 },
  { item: 'project management licenses per month', unitCost: 15 },
  { item: 'weekly team lunch budget', unitCost: 100 },
]

export function generateComparison(cost: number): string {
  if (cost <= 0) return '0 items'
  const random = COMPARISONS[Math.floor(Math.random() * COMPARISONS.length)]
  if (!random) return '0 items'
  const quantity = Math.floor(cost / random.unitCost)
  return `${quantity} ${random.item}`
}

export function generateComparisonList(cost: number, count = 3): string[] {
  const results: string[] = []
  const used = new Set<number>()

  while (results.length < count && used.size < COMPARISONS.length) {
    let idx = Math.floor(Math.random() * COMPARISONS.length)
    while (used.has(idx)) {
      idx = (idx + 1) % COMPARISONS.length
    }
    used.add(idx)
    const comp = COMPARISONS[idx]
    if (!comp) continue
    const quantity = Math.floor(cost / comp.unitCost)
    if (quantity > 0) {
      results.push(`${quantity} ${comp.item}`)
    }
  }

  return results
}
