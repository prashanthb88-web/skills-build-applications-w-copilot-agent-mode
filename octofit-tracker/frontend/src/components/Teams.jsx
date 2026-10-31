import { fetchCollection as fetch } from '../api.js'
import { useApiCollection } from '../hooks/useApiCollection.js'
import CollectionView from './CollectionView.jsx'

function Teams() {
  const { items, loading, error } = useApiCollection(
    '/api/teams/',
    fetch,
  )

  return (
    <CollectionView
      title="Teams"
      description="Meet the teams training and competing together."
      items={items}
      loading={loading}
      error={error}
      emptyMessage="No teams have been created yet."
      renderItem={(team) => (
        <article className="card collection-card h-100">
          <div className="card-body">
            <h2 className="card-title h5">{team.name || 'Unnamed team'}</h2>
            <p className="text-secondary">
              {team.description || 'No team description yet.'}
            </p>
            <p className="small fw-semibold mt-3 mb-0">
              {Array.isArray(team.members) ? team.members.length : 0} members
            </p>
          </div>
        </article>
      )}
    />
  )
}

export default Teams
