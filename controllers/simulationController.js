
const { Simulation } = require("../models");

// Halaman utama
exports.home = (req, res) => {
    res.render("home");
};

// Halaman form
exports.form = (req, res) => {
    res.render("form");
};

// Proses simulasi
exports.calculate = async (req, res) => {
    try {
        const v0 = Number(req.body.v0);
        const theta = Number(req.body.theta);
        const massa = Number(req.body.massa);
        const cd = Number(req.body.cd);
        const area = Number(req.body.area);
        const rho = Number(req.body.rho);
        const gravity = Number(req.body.gravity);
        const dt = Number(req.body.dt);

        const values = [v0, theta, massa, cd, area, rho, gravity, dt];

        if (
            values.some(value => !Number.isFinite(value)) ||
            v0 <= 0 ||
            massa <= 0 ||
            cd < 0 ||
            area < 0 ||
            rho < 0 ||
            gravity <= 0 ||
            dt <= 0
        ) {
            return res.status(400).send("Input simulasi tidak valid.");
        }

        const sudut = theta * Math.PI / 180;

        let vx = v0 * Math.cos(sudut);
        let vy = v0 * Math.sin(sudut);

        let x = 0;
        let y = 0;
        let waktu = 0;
        let tinggiMaksimum = 0;

        const k = 0.5 * rho * cd * area;
        const trajectory = [{ t: 0, x: 0, y: 0 }];

        for (let i = 0; i < 1000000; i++) {
            const v = Math.sqrt(vx * vx + vy * vy);

            const ax = -(k / massa) * v * vx;
            const ay = -gravity - (k / massa) * v * vy;

            const xSebelumnya = x;
            const ySebelumnya = y;

            vx += ax * dt;
            vy += ay * dt;

            x += vx * dt;
            y += vy * dt;
            waktu += dt;

            tinggiMaksimum = Math.max(tinggiMaksimum, y);

            if (y <= 0) {
                const faktor = ySebelumnya !== y
                    ? Math.max(0, Math.min(1, ySebelumnya / (ySebelumnya - y)))
                    : 0;

                x = xSebelumnya + faktor * (x - xSebelumnya);
                waktu = waktu - dt + faktor * dt;

                trajectory.push({ t: waktu, x, y: 0 });
                break;
            }

            trajectory.push({ t: waktu, x, y });

            if (i === 999999) {
                throw new Error("Simulasi mencapai batas iterasi.");
            }
        }

        const kecepatan = Math.sqrt(vx * vx + vy * vy);

        const hasil = {
            v0,
            theta,
            massa,
            cd,
            area,
            rho,
            gravity,
            dt,
            jarak: x,
            tinggi: tinggiMaksimum,
            waktu,
            kecepatan
        };

        await Simulation.create({
            ...hasil,
            trajectory: JSON.stringify(trajectory)
        });

        res.render("result", {
            hasil,
            trajectory
        });

    } catch (error) {
        console.error("Gagal melakukan simulasi:", error);
        res.status(500).send("Terjadi kesalahan saat simulasi.");
    }
};

// Riwayat
exports.history = async (req, res) => {
    try {
        const data = await Simulation.findAll({
            order: [["createdAt", "DESC"]]
        });

        res.render("history", { data });

    } catch (error) {
        console.error("Gagal mengambil riwayat:", error);
        res.status(500).send("Gagal mengambil riwayat simulasi.");
    }
};
