const rupee = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function formatPrice(price: number) {
  return rupee.format(price)
}
export function formatDate(value: string) {
  const date = new Date(value.replace(' ', 'T') + 'Z')
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}