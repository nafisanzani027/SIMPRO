const express = require("express");
const path = require("path");

const database = require("./config/database");
const routes = require("./routes");

const app = express();

// Mengatur EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Folder file statis
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", routes);

// Test koneksi aplikasi
app.get("/test", (req, res) => {
    res.send("SIMPRO BERHASIL TERHUBUNG!");
});

// Port untuk hosting
const PORT = process.env.PORT || 3000;

// Menjalankan server
async function startServer() {
    try {
        await database.authenticate();

        console.log("Database berhasil terhubung!");

        await database.sync();

        console.log("Database berhasil disinkronisasi!");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`SIMPRO berjalan di port ${PORT}`);
        });

    } catch (error) {
        console.error("Gagal menjalankan aplikasi:", error);
        process.exit(1);
    }
}

// Memulai aplikasi
startServer();