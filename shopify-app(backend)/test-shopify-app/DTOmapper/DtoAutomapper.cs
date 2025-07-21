using AutoMapper;
using test_shopify_app.DTOs.Agentdto;
using test_shopify_app.DTOs.customerdto;
using test_shopify_app.DTOs.orderdto;
using test_shopify_app.DTOs.productdto;
using test_shopify_app.Entities;

namespace test_shopify_app.DTOmapper
{
    public class DtoAutomapper : Profile
    {
        public DtoAutomapper()
        {
            // Product mapping
            CreateMap<Products, NewProduct>().ReverseMap();
            CreateMap<Products, ProductWId>().ReverseMap();

            // Order status updates
            CreateMap<Orders, UpdateOrderstatus>().ReverseMap();

            // Customer mapping
            CreateMap<Customers, NewCustomer>().ReverseMap();

            // DeliveryAgent mappings
            CreateMap<DeliveryAgent, NewAgent>().ReverseMap();
            CreateMap<DeliveryAgent, UpdateAgentName>().ReverseMap();
            CreateMap<DeliveryAgent, UpdateAgentUsername>().ReverseMap();
            CreateMap<DeliveryAgent, UpdateAgentPassword>().ReverseMap();
            CreateMap<DeliveryAgent, UpdateAgentEmail>().ReverseMap();
        }
    }
}
