import { fetchCollection as fetch } from '../api.js'
import { useApiCollection } from '../hooks/useApiCollection.js'
import CollectionView from './CollectionView.jsx'

function Workouts() {
  const { items, loading, error } = useApiCollection(
    '/api/workouts/',
    fetch,
  )

  return (
    <CollectionView
      title="Workouts"
      description="Find a guided session that matches your goals."
      items={items}
      loading={loading}
      error={error}
      emptyMessage="No workout suggestions are available yet."
      renderItem={(workout) => (
        <article className="card collection-card h-100">
          <div className="card-body">
            <div className="d-flex align-items-start justify-content-between gap-2">
              <h2 className="card-title h5">{workout.title || 'Workout'}</h2>
              {workout.difficulty && (
                <span className="badge text-bg-secondary text-capitalize">
                  {workout.difficulty}
                </span>
              )}
            </div>
            <p className="text-secondary">{workout.description}</p>
            <p className="small mb-0 mt-3">
              {workout.durationMinutes ?? '—'} min
              {workout.goal && (
                <span className="text-capitalize"> · {workout.goal}</span>
              )}
            </p>
          </div>
        </article>
      )}
    />
  )
}

export default Workouts
