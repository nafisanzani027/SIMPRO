
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Membuat model simulasi proyektil
const Simulation = sequelize.define("Simulation", {

    // Kecepatan awal
    v0: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // Sudut peluncuran
    theta: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // Massa benda
    massa: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // Koefisien drag
    cd: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // Luas penampang
    area: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // Massa jenis udara
    rho: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // Gravitasi
    gravity: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // Langkah waktu
    dt: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // Jarak horizontal
    jarak: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // Tinggi maksimum
    tinggi: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // Waktu terbang
    waktu: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // Kecepatan saat jatuh
    kecepatan: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // Data lintasan proyektil
    trajectory: {
        type: DataTypes.TEXT,
        allowNull: false
    }

});

// Export model
module.exports = Simulation;
