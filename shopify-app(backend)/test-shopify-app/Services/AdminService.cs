using AutoMapper;
using test_shopify_app.appDataBase;
using test_shopify_app.DTOs.admindto;
using test_shopify_app.Entities;

namespace test_shopify_app.Services
{
    public class AdminService
    {
        private readonly AppDBcontext _db;
        private readonly IMapper _mapper;

        public AdminService(AppDBcontext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }


        public Admin? ValidateAdmin(string username, string password)
        {
            return _db.Admins.FirstOrDefault(a => a.AdminUsername == username && a.AdminPassword == password);
        }

        // ✅ Register a new customer
        public string RegisterAdmin(NewAdmin newadmin)
        {
            if (_db.Admins.Any(c =>
                c.AdminUsername == newadmin.Username ||
                c.AdminUsername == newadmin.Email))
            {
                throw new ArgumentException("Username or Email already exists.");
            }

            var admin = new Admin
            {
                AdminName = newadmin.Name,
                AdminUsername = newadmin.Username,
                AdminPassword = newadmin.Password,
                AdminEmail = newadmin.Email,
                AdminPhone = newadmin.Phone,

            };

            _db.Admins.Add(admin);
            _db.SaveChanges();
            return "Admin registered successfully";
        }

        // ✅ Update Name
        public string UpdateAdminName(Updateaname dto)
        {
            var admin = _db.Admins.Find(dto.Id);
            if (admin == null) throw new ArgumentException("Customer not found.");

            admin.AdminName = dto.Name;
            _db.SaveChanges();
            return "Admin name updated successfully.";
        }

        // ✅ Update Username
        public string UpdateAdminUsername(Updateausername dto)
        {
            var admin = _db.Admins.Find(dto.Id);
            if (admin == null) throw new ArgumentException("Admin not found.");

            admin.AdminUsername = dto.Username;
            _db.SaveChanges();
            return "Admin username updated successfully.";
        }

        // ✅ Update Password
        public string UpdateAdminPassword(Updateapassword dto)
        {
            var admin = _db.Admins.Find(dto.Id);
            if (admin == null) throw new ArgumentException("Admin not found.");

            admin.AdminPassword = dto.Password;
            _db.SaveChanges();
            return "Admin password updated successfully.";
        }

        // ✅ Update Email
        public string UpdateAdminEmail(Updateamail dto)
        {
            var admin = _db.Admins.Find(dto.Id);
            if (admin == null) throw new ArgumentException("Admin not found.");

            admin.AdminEmail = dto.Email;
            _db.SaveChanges();
            return "Admin email updated successfully.";
        }
        public string UpdateAdminPhone(Updateaphone dto)
        {
            var admin = _db.Admins.Find(dto.Id);
            if (admin == null) throw new ArgumentException("Admin not found.");

            admin.AdminPhone = dto.Phone;
            _db.SaveChanges();
            return "Admin Phone updated successfully.";
        }

        // ✅ Get by ID
        public Admin GetAdminById(int id)
        {
            var admin = _db.Admins.Find(id);
            if (admin == null)
            {
                throw new ArgumentException("Admin not found.");
            }
            return admin;
        }

    }
}
