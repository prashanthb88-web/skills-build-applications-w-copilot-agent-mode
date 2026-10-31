import { fetchCollection as fetch } from '../api.js'
import { useApiCollection } from '../hooks/useApiCollection.js'
import CollectionView from './CollectionView.jsx'

function getName(value, fallback) {
  if (typeof value === 'string') return value
  return value?.fullName || value?.name || value?.username || fallback
}

function Leaderboard() {
  const { items, loading, error } = useApiCollection(
    '/api/leaderboard/',
    fetch,
  )

  return (
    <CollectionView
      title="Leaderboard"
      description="See how athletes and teams are stacking up."
      items={items}
      loading={loading}
      error={error}
      emptyMessage="The leaderboard is waiting for its first results."
      renderItem={(entry, index) => (
        <article className="card collection-card h-100">
          <div className="card-body d-flex align-items-start gap-3">
            <span className="badge text-bg-primary rounded-pill fs-6">
              #{index + 1}
            </span>
            <div className="flex-grow-1">
              <h2 className="card-title h5 mb-1">
                {getName(entry.user, 'Unknown athlete')}
              </h2>
              <p className="text-secondary mb-2">
                {getName(entry.team, 'Independent athlete')}
              </p>
              <strong>{entry.points ?? 0} points</strong>
            </div>
          </div>
        </article>
      )}
    />
  )
}

export default Leaderboard
