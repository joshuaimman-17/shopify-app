using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace test_shopify_app.Migrations
{
    /// <inheritdoc />
    public partial class deliveryagentaddup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Orders_OrdersId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Customers");

            migrationBuilder.RenameColumn(
                name: "OrdersId",
                table: "Products",
                newName: "OrdersOrderId");

            migrationBuilder.RenameIndex(
                name: "IX_Products_OrdersId",
                table: "Products",
                newName: "IX_Products_OrdersOrderId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Orders",
                newName: "OrderId");

            migrationBuilder.RenameColumn(
                name: "Address",
                table: "Customers",
                newName: "Username");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "DeliveryAgentAgentId",
                table: "Orders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeliveryAgentAgentId1",
                table: "Orders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Orders",
                type: "nvarchar(15)",
                maxLength: 15,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Admins",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "deliveryAgents",
                columns: table => new
                {
                    AgentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AgentName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_deliveryAgents", x => x.AgentId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_DeliveryAgentAgentId",
                table: "Orders",
                column: "DeliveryAgentAgentId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_DeliveryAgentAgentId1",
                table: "Orders",
                column: "DeliveryAgentAgentId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_deliveryAgents_DeliveryAgentAgentId",
                table: "Orders",
                column: "DeliveryAgentAgentId",
                principalTable: "deliveryAgents",
                principalColumn: "AgentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_deliveryAgents_DeliveryAgentAgentId1",
                table: "Orders",
                column: "DeliveryAgentAgentId1",
                principalTable: "deliveryAgents",
                principalColumn: "AgentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Orders_OrdersOrderId",
                table: "Products",
                column: "OrdersOrderId",
                principalTable: "Orders",
                principalColumn: "OrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_deliveryAgents_DeliveryAgentAgentId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_deliveryAgents_DeliveryAgentAgentId1",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Orders_OrdersOrderId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "deliveryAgents");

            migrationBuilder.DropIndex(
                name: "IX_Orders_DeliveryAgentAgentId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_DeliveryAgentAgentId1",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "DeliveryAgentAgentId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "DeliveryAgentAgentId1",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Username",
                table: "Admins");

            migrationBuilder.RenameColumn(
                name: "OrdersOrderId",
                table: "Products",
                newName: "OrdersId");

            migrationBuilder.RenameIndex(
                name: "IX_Products_OrdersOrderId",
                table: "Products",
                newName: "IX_Products_OrdersId");

            migrationBuilder.RenameColumn(
                name: "OrderId",
                table: "Orders",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Customers",
                newName: "Address");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Customers",
                type: "nvarchar(15)",
                maxLength: 15,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Orders_OrdersId",
                table: "Products",
                column: "OrdersId",
                principalTable: "Orders",
                principalColumn: "Id");
        }
    }
}
