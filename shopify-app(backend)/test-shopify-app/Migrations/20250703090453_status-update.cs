using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace test_shopify_app.Migrations
{
    /// <inheritdoc />
    public partial class statusupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_DeliveryAgents_DeliveryAgentAgentId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_DeliveryAgents_DeliveryAgentAgentId1",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_DeliveryAgents_DeliveryAgentId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_DeliveryAgentAgentId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_DeliveryAgentAgentId1",
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

            migrationBuilder.RenameColumn(
                name: "ProductImageUrl",
                table: "Products",
                newName: "ProductimageURL");

            migrationBuilder.RenameColumn(
                name: "Price",
                table: "Products",
                newName: "ProductPrice");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Products",
                newName: "ProductId");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "DeliveryAgents",
                newName: "AgentUsername");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "DeliveryAgents",
                newName: "AgentPassword");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "DeliveryAgents",
                newName: "AgentEmail");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Customers",
                newName: "CustomerUsername");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Customers",
                newName: "CustomerPassword");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Customers",
                newName: "CustomerName");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Customers",
                newName: "CustomerEmail");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Customers",
                newName: "CustomerId");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Admins",
                newName: "AdminUsername");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Admins",
                newName: "AdminName");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Admins",
                newName: "AdminEmail");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Admins",
                newName: "AdminId");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Orders",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "DeliveryAgentId",
                table: "Orders",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<long>(
                name: "AgentPhone",
                table: "DeliveryAgents",
                type: "bigint",
                maxLength: 15,
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "CustomerPhone",
                table: "Customers",
                type: "bigint",
                maxLength: 15,
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "AdminPassword",
                table: "Admins",
                type: "nvarchar(8)",
                maxLength: 8,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<long>(
                name: "AdminPhone",
                table: "Admins",
                type: "bigint",
                maxLength: 15,
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateTable(
                name: "OrderStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderStatus", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Products_ProductId",
                table: "OrderItems",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "ProductId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_DeliveryAgents_DeliveryAgentId",
                table: "Orders",
                column: "DeliveryAgentId",
                principalTable: "DeliveryAgents",
                principalColumn: "AgentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Products_ProductId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_DeliveryAgents_DeliveryAgentId",
                table: "Orders");

            migrationBuilder.DropTable(
                name: "OrderStatus");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "AgentPhone",
                table: "DeliveryAgents");

            migrationBuilder.DropColumn(
                name: "CustomerPhone",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "AdminPassword",
                table: "Admins");

            migrationBuilder.DropColumn(
                name: "AdminPhone",
                table: "Admins");

            migrationBuilder.RenameColumn(
                name: "ProductimageURL",
                table: "Products",
                newName: "ProductImageUrl");

            migrationBuilder.RenameColumn(
                name: "ProductPrice",
                table: "Products",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "Products",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "AgentUsername",
                table: "DeliveryAgents",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "AgentPassword",
                table: "DeliveryAgents",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "AgentEmail",
                table: "DeliveryAgents",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "CustomerUsername",
                table: "Customers",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "CustomerPassword",
                table: "Customers",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "CustomerName",
                table: "Customers",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "CustomerEmail",
                table: "Customers",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "CustomerId",
                table: "Customers",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "AdminUsername",
                table: "Admins",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "AdminName",
                table: "Admins",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "AdminEmail",
                table: "Admins",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "AdminId",
                table: "Admins",
                newName: "Id");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "DeliveryAgentId",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

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
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_DeliveryAgentAgentId",
                table: "Orders",
                column: "DeliveryAgentAgentId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_DeliveryAgentAgentId1",
                table: "Orders",
                column: "DeliveryAgentAgentId1");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_DeliveryAgents_DeliveryAgentId",
                table: "Orders",
                column: "DeliveryAgentId",
                principalTable: "DeliveryAgents",
                principalColumn: "AgentId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
