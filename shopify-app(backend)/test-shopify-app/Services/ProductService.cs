using AutoMapper;
using test_shopify_app.appDataBase;
using test_shopify_app.DTOs.productdto;
using test_shopify_app.Entities;

namespace test_shopify_app.Services
{
    public class ProductService
    {
        private readonly AppDBcontext _db;
        private readonly IMapper _mapper;

        public ProductService(AppDBcontext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public List<Products> GetAllProducts()
        {
            return _db.Products.ToList();
        }

        public Products GetProductById(int id)
        {
            return _db.Products.FirstOrDefault(p => p.ProductId == id);
        }

        public Products AddProduct(NewProduct newProductDto)
        {
            var product = _mapper.Map<Products>(newProductDto);
            _db.Products.Add(product);
            _db.SaveChanges();
            return product;
        }

        public Products UpdateProduct(ProductWId updatedDto)
        {
            var existing = _db.Products.FirstOrDefault(p => p.ProductId == updatedDto.ProductId);
            if (existing == null) return null;

            _mapper.Map(updatedDto, existing);
            _db.SaveChanges();
            return existing;
        }

        public bool DeleteProduct(int id)
        {
            var product = _db.Products.FirstOrDefault(p => p.ProductId == id);
            if (product == null) return false;

            _db.Products.Remove(product);
            _db.SaveChanges();
            return true;
        }
    }
}
