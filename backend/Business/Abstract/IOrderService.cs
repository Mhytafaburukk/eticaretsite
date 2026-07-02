using Entities.Concrete;

namespace Business.Abstract
{
    public interface IOrderService
    {
        List<Order> GetAll();
        Order GetById(int id);
        void Add(Order entity);
        void Update(Order entity);
        void Delete(Order entity);
    }
}
