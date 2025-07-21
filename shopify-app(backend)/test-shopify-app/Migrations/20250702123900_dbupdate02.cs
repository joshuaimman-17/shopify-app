using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace test_shopify_app.Migrations
{
    /// <inheritdoc />
    public partial class dbupdate02 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Customers_CustomersId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_deliveryAgents_DeliveryAgentAgentId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_deliveryAgents_DeliveryAgentAgentId1",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_CustomersId",
                table: "Orders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_deliveryAgents",
                table: "deliveryAgents");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CustomersId",
                table: "Orders");

            migrationBuilder.RenameTable(
                name: "deliveryAgents",
                newName: "DeliveryAgents");

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(15)",
                oldMaxLength: 15);

            migrationBuilder.AlterColumn<int>(
                name: "CustomerId",
                table: "Orders",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DeliveryAgents",
                table: "DeliveryAgents",
                column: "AgentId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerId",
                table: "Orders",
                column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Customers_CustomerId",
                table: "Orders",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_DeliveryAgents_DeliveryAgentAgentId",
                table: "Orders",
                column: "DeliveryAgentAgentId",
                principalTable: "DeliveryAgents",
                principalColumn: "AgentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_DeliveryAgents_DeliveryAgentAgentId1",
                table: "Orders",
                column: "DeliveryAgentAgentId1",
                principalTable: "DeliveryAgents",
                principalColumn: "AgentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Customers_CustomerId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_DeliveryAgents_DeliveryAgentAgentId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_DeliveryAgents_DeliveryAgentAgentId1",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_CustomerId",
                table: "Orders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DeliveryAgents",
                table: "DeliveryAgents");

            migrationBuilder.RenameTable(
                name: "DeliveryAgents",
                newName: "deliveryAgents");

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "Orders",
                type: "nvarchar(15)",
                maxLength: 15,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CustomerId",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "CustomersId",
                table: "Orders",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_deliveryAgents",
                table: "deliveryAgents",
                column: "AgentId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomersId",
                table: "Orders",
                column: "CustomersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Customers_CustomersId",
                table: "Orders",
                column: "CustomersId",
                principalTable: "Customers",
                principalColumn: "Id");

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
        }
    }
}
