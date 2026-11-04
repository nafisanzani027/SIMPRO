
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

// Folder untuk file CSS, JavaScript, dan gambar
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", routes);

app.get("/test", (req, res) => {
    res.send("SIMULASI PROYEKTIL BERHASIL TERHUBUNG");
});

// Port aplikasi
const PORT = 3000;

// Menjalankan server
async function startServer() {
    try {
        // Mengecek koneksi database
        await database.authenticate();

        console.log("Database berhasil terhubung!");

        // Membuat tabel jika belum tersedia
        await database.sync();

        console.log("Database berhasil disinkronisasi!");

        // Menjalankan aplikasi
        app.listen(PORT, () => {
            console.log(
                `Server berjalan di http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "Gagal menjalankan aplikasi:",
            error
        );
    }
}

// Memulai aplikasi
startServer();
