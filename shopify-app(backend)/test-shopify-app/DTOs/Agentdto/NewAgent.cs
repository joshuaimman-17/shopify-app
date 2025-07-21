namespace test_shopify_app.DTOs.Agentdto
{
    public class NewAgent
    {
        public string AgentName { get; set; }
        public string AgentUsername { get; set; }  // Changed from Username
        public string AgentPassword { get; set; }  // Changed from Password
        public string AgentEmail { get; set; }     // Changed from Email
        public long AgentPhone { get; set; }       // Changed from Phone
    }

   
}
