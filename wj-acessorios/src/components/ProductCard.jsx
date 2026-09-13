function ProductCard({ product }) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  return (
    <div className="product-card">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="product-card__image" />
      ) : (
        <div className="product-card__image product-card__image--placeholder">
          Sem imagem
        </div>
      )}
      <h3 className="product-card__name">{product.name}</h3>
      <p className="product-card__category">{product.category}</p>
      <p className="product-card__price">{formattedPrice}</p>
    </div>
  );
}

export default ProductCard;