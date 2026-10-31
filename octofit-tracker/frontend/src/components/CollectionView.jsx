function CollectionView({
  title,
  description,
  items,
  loading,
  error,
  emptyMessage,
  renderItem,
}) {
  return (
    <section aria-labelledby="collection-title">
      <div className="mb-4">
        <h1 className="h2 mb-2" id="collection-title">
          {title}
        </h1>
        <p className="text-secondary mb-0">{description}</p>
      </div>

      {loading && (
        <div className="d-flex align-items-center gap-2 text-secondary" role="status">
          <span className="spinner-border spinner-border-sm" aria-hidden="true" />
          Loading {title.toLowerCase()}…
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          Could not load {title.toLowerCase()}: {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="alert alert-light border" role="status">
          {emptyMessage}
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="row g-3">
          {items.map((item, index) => (
            <div className="col-12 col-md-6 col-xl-4" key={item._id ?? index}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default CollectionView
