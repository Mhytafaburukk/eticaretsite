using Business.Abstract;
using DataAccess.Abstract;
using Entities.Concrete;

namespace Business.Concrete
{
    public class OrderManager : IOrderService
    {
        private readonly IOrderDal _dal;
        private readonly IProductService _productService;

        public OrderManager(IOrderDal dal, IProductService productService)
        {
            _dal = dal;
            _productService = productService;
        }

        public void Add(Order entity)
        {
            // Business Rule: Check stock for each item
            foreach (var item in entity.OrderItems)
            {
                var product = _productService.GetById(item.ProductId);
                if (product == null)
                    throw new Exception($"Ürün bulunamadı (ID: {item.ProductId})");
                
                if (product.UnitsInStock < item.Quantity)
                    throw new Exception($"'{product.Name}' ürünü için yeterli stok yok. Kalan stok: {product.UnitsInStock}");
                
                // Stok yeterliyse düş
                product.UnitsInStock -= item.Quantity;
                _productService.Update(product);
            }

            _dal.Add(entity);
        }

        public void Delete(Order entity)
        {
            _dal.Delete(entity);
        }

        public List<Order> GetAll()
        {
            return _dal.GetAll();
        }

        public Order GetById(int id)
        {
            return _dal.Get(e => e.Id == id);
        }

        public void Update(Order entity)
        {
            _dal.Update(entity);
        }
    }
}
