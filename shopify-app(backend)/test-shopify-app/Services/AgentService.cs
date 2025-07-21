using AutoMapper;
using test_shopify_app.appDataBase;
using test_shopify_app.DTOs.Agentdto;
using test_shopify_app.Entities;


namespace test_shopify_app.Services
{
    public class AgentService
    {
        private readonly AppDBcontext _db;
        private readonly IMapper _mapper;

        public AgentService(AppDBcontext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public DeliveryAgent? ValidateAgent(string username, string password)
        {
            return _db.DeliveryAgents.FirstOrDefault(a => a.AgentUsername == username && a.AgentPassword == password);
        }

        public string Register(NewAgent newAgent)
        {
            if (_db.DeliveryAgents.Any(a => a.AgentUsername == newAgent.AgentUsername || a.AgentEmail == newAgent.AgentEmail))
            {
                throw new ArgumentException("Username or Email already exists.");
            }

            var agent = _mapper.Map<DeliveryAgent>(newAgent);

            _db.DeliveryAgents.Add(agent);
            _db.SaveChanges();

            return "Agent registered successfully";
        }

        public string UpdateAgentName(UpdateAgentName updatedAgent)
        {
            var agent = _db.DeliveryAgents.Find(updatedAgent.Id);
            if (agent == null)
                throw new ArgumentException("Agent not found.");

            agent.AgentName = updatedAgent.AgentName;
            _db.DeliveryAgents.Update(agent);
            _db.SaveChanges();

            return "Name updated successfully";
        }

        public string UpdateAgentUsername(UpdateAgentUsername updatedAgent)
        {
            var agent = _db.DeliveryAgents.Find(updatedAgent.Id);
            if (agent == null)
                throw new ArgumentException("Agent not found.");

            agent.AgentUsername = updatedAgent.AgentUsername;
            _db.DeliveryAgents.Update(agent);
            _db.SaveChanges();

            return "Username updated successfully";
        }

        public string UpdateAgentPassword(UpdateAgentPassword updatedAgent)
        {
            var agent = _db.DeliveryAgents.Find(updatedAgent.Id);
            if (agent == null)
                throw new ArgumentException("Agent not found.");

            agent.AgentPassword = updatedAgent.AgentPassword;
            _db.DeliveryAgents.Update(agent);
            _db.SaveChanges();

            return "Password updated successfully";
        }

        public string UpdateAgentEmail(UpdateAgentEmail updatedAgent)
        {
            var agent = _db.DeliveryAgents.Find(updatedAgent.Id);
            if (agent == null)
                throw new ArgumentException("Agent not found.");

            agent.AgentEmail = updatedAgent.AgentEmail;
            _db.DeliveryAgents.Update(agent);
            _db.SaveChanges();

            return "Email updated successfully";
        }

        public DeliveryAgent GetAgentById(int id)
        {
            var agent = _db.DeliveryAgents.Find(id);
            if (agent == null)
                throw new ArgumentException("Agent not found.");

            return agent;
        }

        public List<DeliveryAgent> GetAllAgents()
        {
            return _db.DeliveryAgents.ToList();
        }
    }
}
