const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

if (codespaceName && !/^[a-z0-9-]+$/i.test(codespaceName)) {
  throw new Error(
    'VITE_CODESPACE_NAME must contain only letters, numbers, and hyphens.',
  )
}

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export async function fetchCollection(endpoint, signal) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { signal })
  const payload = await response.json()

  if (!response.ok) {
    throw new Error(
      payload?.error || `API request failed with status ${response.status}.`,
    )
  }

  const collection = Array.isArray(payload)
    ? payload
    : [
        payload?.results,
        payload?.data,
        payload?.data?.results,
        payload?.items,
      ].find(Array.isArray)

  if (!collection) {
    throw new Error(
      'The API response must be an array or a paginated collection.',
    )
  }

  return collection
}
