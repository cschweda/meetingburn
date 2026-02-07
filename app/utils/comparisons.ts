const COMPARISONS = [
  { item: 'Chipotle burritos', unitCost: 12 },
  { item: 'Starbucks lattes', unitCost: 5.5 },
  { item: 'movie tickets', unitCost: 15 },
  { item: 'months of Netflix', unitCost: 15.49 },
  { item: 'tanks of gas', unitCost: 50 },
  { item: 'gym memberships', unitCost: 40 },
  { item: 'phone bills', unitCost: 80 },
  { item: 'weeks of groceries', unitCost: 150 },
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
