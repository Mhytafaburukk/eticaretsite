using Business.Abstract;
using DataAccess.Abstract;
using Entities.Concrete;

namespace Business.Concrete
{
    public class OrderManager : IOrderService
    {
        private readonly IOrderDal _dal;

        public OrderManager(IOrderDal dal)
        {
            _dal = dal;
        }

        public void Add(Order entity)
        {
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
