import { emptyFilters, type Filters } from '../types'

interface Props {
  filters: Filters
  onChange: (filters: Filters) => void
}

const fields = [
  { name: 'make', placeholder: 'Make', type: 'text' },
  { name: 'model', placeholder: 'Model', type: 'text' },
  { name: 'category', placeholder: 'Category', type: 'text' },
  { name: 'minPrice', placeholder: 'Min price (₹)', type: 'number' },
  { name: 'maxPrice', placeholder: 'Max price (₹)', type: 'number' },
] as const

export default function SearchBar({ filters, onChange }: Props) {
  function update(field: keyof Filters, value: string) {
    onChange({ ...filters, [field]: value })
  }

  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl bg-white p-4 shadow md:grid-cols-6">
      {fields.map((field) => (
        <input
          key={field.name}
          type={field.type}
          min={field.type === 'number' ? 0 : undefined}
          placeholder={field.placeholder}
          value={filters[field.name]}
          onChange={(e) => update(field.name, e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      ))}
      <button
        onClick={() => onChange(emptyFilters)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
      >
        Clear
      </button>
    </div>
  )
}