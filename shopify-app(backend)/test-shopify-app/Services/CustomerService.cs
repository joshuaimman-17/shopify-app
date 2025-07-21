using AutoMapper;
using test_shopify_app.appDataBase;
using test_shopify_app.DTOs.customerdto;
using test_shopify_app.Entities;

namespace test_shopify_app.Services
{
    public class CustomerService
    {
        private readonly AppDBcontext _db;
        private readonly IMapper _mapper;

        public CustomerService(AppDBcontext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public Customers? ValidateCustomer(string username, string password)
        {
            return _db.Customers.FirstOrDefault(a => a.CustomerUsername == username && a.CustomerPassword == password);
        }

        // ✅ Register a new customer
        public string RegisterCustomer(NewCustomer newCustomer)
        {
            if (_db.Customers.Any(c =>
                c.CustomerUsername == newCustomer.Username ||
                c.CustomerEmail == newCustomer.Email))
            {
                throw new ArgumentException("Username or Email already exists.");
            }

            var customer = new Customers
            {
                CustomerName = newCustomer.Name,
                CustomerUsername = newCustomer.Username,
                CustomerPassword = newCustomer.Password,
                CustomerEmail = newCustomer.Email,
                CustomerPhone = newCustomer.Phone,

            };

            _db.Customers.Add(customer);
            _db.SaveChanges();
            return "Customer registered successfully";
        }

        // ✅ Update Name
        public string UpdateCustomerName(Updatecname dto)
        {
            var customer = _db.Customers.Find(dto.Id);
            if (customer == null) throw new ArgumentException("Customer not found.");

            customer.CustomerName = dto.Name;
            _db.SaveChanges();
            return "Customer name updated successfully.";
        }

        // ✅ Update Username
        public string UpdateCustomerUsername(Updatecusername dto)
        {
            var customer = _db.Customers.Find(dto.Id);
            if (customer == null) throw new ArgumentException("Customer not found.");

            customer.CustomerUsername = dto.Username;
            _db.SaveChanges();
            return "Customer username updated successfully.";
        }

        // ✅ Update Password
        public string UpdateCustomerPassword(Updatecpassword dto)
        {
            var customer = _db.Customers.Find(dto.Id);
            if (customer == null) throw new ArgumentException("Customer not found.");

            customer.CustomerPassword = dto.Password;
            _db.SaveChanges();
            return "Customer password updated successfully.";
        }

        // ✅ Update Email
        public string UpdateCustomerEmail(Updatecmail dto)
        {
            var customer = _db.Customers.Find(dto.Id);
            if (customer == null) throw new ArgumentException("Customer not found.");

            customer.CustomerEmail = dto.Email;
            _db.SaveChanges();
            return "Customer email updated successfully.";
        }
        public string UpdateCustomerPhone(Updatecphone dto)
        {
            var customer = _db.Customers.Find(dto.Id);
            if (customer == null) throw new ArgumentException("Customer not found.");

            customer.CustomerPhone = dto.Phone;
            _db.SaveChanges();
            return "Customer Phone updated successfully.";
        }

        // ✅ Get by ID
        public Customers GetCustomerById(int id)
        {
            var customer = _db.Customers.Find(id);
            if (customer == null)
            {
                throw new ArgumentException("Customer not found.");
            }
            return customer;
        }

        public Customers GetCustomerByUsername(string id)
        {
            var customer = _db.Customers.Find(id);
            if (customer == null)
            {
                throw new ArgumentException("Customer not found.");
            }
            return customer;
        }

        // ✅ Get all
        public List<Customers> GetAllCustomers()
        {
            return _db.Customers.ToList();
        }
    }
}
