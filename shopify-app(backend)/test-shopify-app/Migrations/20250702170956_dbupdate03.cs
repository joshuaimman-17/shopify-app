using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace test_shopify_app.Migrations
{
    /// <inheritdoc />
    public partial class dbupdate03 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Products_ProductId",
                table: "OrderItems");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems");

            migrationBuilder.AddColumn<int>(
                name: "DeliveryAgentId",
                table: "Orders",
                type: "int",
                nullable: true); // <-- changed from false to true

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "DeliveryAgents",
                type: "nvarchar(8)",
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_DeliveryAgentId",
                table: "Orders",
                column: "DeliveryAgentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_DeliveryAgents_DeliveryAgentId",
                table: "Orders",
                column: "DeliveryAgentId",
                principalTable: "DeliveryAgents",
                principalColumn: "AgentId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_DeliveryAgents_DeliveryAgentId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_DeliveryAgentId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "DeliveryAgentId",
                table: "Orders");

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "DeliveryAgents",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(8)",
                oldMaxLength: 8);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Products_ProductId",
                table: "OrderItems",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
