using Entities.Concrete;

namespace Business.Abstract
{
    public interface IProductService
    {
        List<Product> GetAll();
        Product GetById(int id);
        void Add(Product entity);
        void Update(Product entity);
        void Delete(Product entity);
    }
}
