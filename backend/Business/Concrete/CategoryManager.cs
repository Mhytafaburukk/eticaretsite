using Business.Abstract;
using DataAccess.Abstract;
using Entities.Concrete;

namespace Business.Concrete
{
    public class CategoryManager : ICategoryService
    {
        private readonly ICategoryDal _dal;

        public CategoryManager(ICategoryDal dal)
        {
            _dal = dal;
        }

        public void Add(Category entity)
        {
            _dal.Add(entity);
        }

        public void Delete(Category entity)
        {
            _dal.Delete(entity);
        }

        public List<Category> GetAll()
        {
            return _dal.GetAll();
        }

        public Category GetById(int id)
        {
            return _dal.Get(e => e.Id == id);
        }

        public void Update(Category entity)
        {
            _dal.Update(entity);
        }
    }
}
