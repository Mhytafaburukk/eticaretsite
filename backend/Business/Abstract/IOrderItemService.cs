using Entities.Concrete;

namespace Business.Abstract
{
    public interface IOrderItemService
    {
        List<OrderItem> GetAll();
        OrderItem GetById(int id);
        void Add(OrderItem entity);
        void Update(OrderItem entity);
        void Delete(OrderItem entity);
    }
}
