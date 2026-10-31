import { fetchCollection as fetch } from '../api.js'
import { useApiCollection } from '../hooks/useApiCollection.js'
import CollectionView from './CollectionView.jsx'

function getTeamName(team) {
  if (typeof team === 'string') return team
  return team?.name || 'No team'
}

function Users() {
  const { items, loading, error } = useApiCollection(
    '/api/users/',
    fetch,
  )

  return (
    <CollectionView
      title="Athletes"
      description="Browse OctoFit members and their team affiliations."
      items={items}
      loading={loading}
      error={error}
      emptyMessage="No athletes have registered yet."
      renderItem={(user) => (
        <article className="card collection-card h-100">
          <div className="card-body">
            <h2 className="card-title h5">{user.fullName || 'Unnamed athlete'}</h2>
            <p className="text-primary mb-2">
              {user.username ? `@${user.username}` : 'No username'}
            </p>
            <p className="mb-1">{user.email || 'No email provided'}</p>
            <p className="small text-secondary mb-0">
              Team: {getTeamName(user.team)}
            </p>
          </div>
        </article>
      )}
    />
  )
}

export default Users
