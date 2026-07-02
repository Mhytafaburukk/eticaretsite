using Entities.Concrete;

namespace Business.Abstract
{
    public interface ICategoryService
    {
        List<Category> GetAll();
        Category GetById(int id);
        void Add(Category entity);
        void Update(Category entity);
        void Delete(Category entity);
    }
}
