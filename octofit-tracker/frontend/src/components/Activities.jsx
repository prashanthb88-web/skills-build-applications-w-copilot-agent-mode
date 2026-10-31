import { fetchCollection as fetch } from '../api.js'
import { useApiCollection } from '../hooks/useApiCollection.js'
import CollectionView from './CollectionView.jsx'

function getUserName(user) {
  if (typeof user === 'string') return user
  return user?.fullName || user?.username || 'Unknown athlete'
}

function Activities() {
  const { items, loading, error } = useApiCollection(
    '/api/activities/',
    fetch,
  )

  return (
    <CollectionView
      title="Activities"
      description="Recent training sessions logged by the community."
      items={items}
      loading={loading}
      error={error}
      emptyMessage="No activities have been logged yet."
      renderItem={(activity) => (
        <article className="card collection-card h-100">
          <div className="card-body">
            <h2 className="card-title h5 text-capitalize">
              {activity.activityType || 'Activity'}
            </h2>
            <p className="text-secondary mb-3">{getUserName(activity.user)}</p>
            <dl className="row mb-0">
              <dt className="col-7">Duration</dt>
              <dd className="col-5 text-end">
                {activity.durationMinutes ?? '—'} min
              </dd>
              {activity.distanceKm != null && (
                <>
                  <dt className="col-7">Distance</dt>
                  <dd className="col-5 text-end">{activity.distanceKm} km</dd>
                </>
              )}
              {activity.calories != null && (
                <>
                  <dt className="col-7">Calories</dt>
                  <dd className="col-5 text-end">{activity.calories}</dd>
                </>
              )}
            </dl>
          </div>
        </article>
      )}
    />
  )
}

export default Activities
