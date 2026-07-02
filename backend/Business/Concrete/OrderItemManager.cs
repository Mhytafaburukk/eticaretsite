using Business.Abstract;
using DataAccess.Abstract;
using Entities.Concrete;

namespace Business.Concrete
{
    public class OrderItemManager : IOrderItemService
    {
        private readonly IOrderItemDal _dal;

        public OrderItemManager(IOrderItemDal dal)
        {
            _dal = dal;
        }

        public void Add(OrderItem entity)
        {
            _dal.Add(entity);
        }

        public void Delete(OrderItem entity)
        {
            _dal.Delete(entity);
        }

        public List<OrderItem> GetAll()
        {
            return _dal.GetAll();
        }

        public OrderItem GetById(int id)
        {
            return _dal.Get(e => e.Id == id);
        }

        public void Update(OrderItem entity)
        {
            _dal.Update(entity);
        }
    }
}
