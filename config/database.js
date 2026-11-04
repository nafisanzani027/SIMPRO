
const { Sequelize } = require("sequelize");
const path = require("path");

// Membuat koneksi database SQLite
const sequelize = new Sequelize({
    dialect: "sqlite",

    // Lokasi database
    storage: path.join(__dirname, "../database.sqlite"),

    // Pengaturan database
    logging: false
});

// Mengecek koneksi database
async function testConnection() {
    try {
        await sequelize.authenticate();

        console.log("Database SQLite berhasil terhubung!");

    } catch (error) {
        console.error("Database gagal terhubung:", error);
    }
}

// Export database
module.exports = sequelize;
