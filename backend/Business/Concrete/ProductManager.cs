using Business.Abstract;
using DataAccess.Abstract;
using Entities.Concrete;

namespace Business.Concrete
{
    public class ProductManager : IProductService
    {
        private readonly IProductDal _dal;

        public ProductManager(IProductDal dal)
        {
            _dal = dal;
        }

        public void Add(Product entity)
        {
            _dal.Add(entity);
        }

        public void Delete(Product entity)
        {
            _dal.Delete(entity);
        }

        public List<Product> GetAll()
        {
            return _dal.GetAll();
        }

        public Product GetById(int id)
        {
            return _dal.Get(e => e.Id == id);
        }

        public void Update(Product entity)
        {
            _dal.Update(entity);
        }
    }
}
