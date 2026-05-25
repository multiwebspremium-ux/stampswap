'use client'
import { useState } from 'react'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { StampCard } from '@/components/ui/StampCard'

const RARITIES = [
  { value: '', label: 'Todas' },
  { value: 'common', label: '⚪ Común' },
  { value: 'rare', label: '🔵 Rara' },
  { value: 'star', label: '⭐ Estrella' },
  { value: 'ultra', label: '💎 Ultra' },
]

interface SearchClientProps {
  initialResults: any[]
  onSearch: (params: { query: string; rarity: string; onlyHave: boolean }) => Promise<any[]>
}

export function SearchClient({ initialResults, onSearch }: SearchClientProps) {
  const [results, setResults] = useState(initialResults)
  const [query, setQuery] = useState('')
  const [rarity, setRarity] = useState('')
  const [onlyHave, setOnlyHave] = useState(true)
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    setLoading(true)
    const data = await onSearch({ query, rarity, onlyHave })
    setResults(data)
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Buscar jugador o selección..."
          className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors text-sm"
        />
        <Button onClick={handleSearch} disabled={loading} size="md" className="px-4">🔍</Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex gap-2 flex-wrap">
          {RARITIES.map(r => (
            <button key={r.value} onClick={() => setRarity(r.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                rarity === r.value ? 'bg-primary/15 border-primary text-primary' : 'bg-base border-border text-muted'
              }`}>
              {r.label}
            </button>
          ))}
        </div>
        <Toggle checked={onlyHave} onChange={setOnlyHave} label="Solo disponibles para intercambio" />
      </div>

      <div className="space-y-2">
        {results.length === 0 ? (
          <div className="text-center py-10 text-muted text-sm">No se encontraron estampas</div>
        ) : (
          results.map((s: any) => <StampCard key={s.id} stamp={s} showOwner />)
        )}
      </div>
    </div>
  )
}
