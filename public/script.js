
const dataElement = document.getElementById("trajectory-data");
const canvas = document.getElementById("grafik");
const tabel = document.getElementById("dataTabel");

// Pastikan elemen grafik dan tabel tersedia
if (dataElement && canvas && tabel) {
    try {
        // Mengambil data lintasan dari result.ejs
        const trajectory = JSON.parse(dataElement.textContent);

        // Pastikan data lintasan berbentuk array
        if (!Array.isArray(trajectory) || trajectory.length === 0) {
            throw new Error("Data lintasan tidak tersedia.");
        }

        // Mengambil konteks canvas
        const ctx = canvas.getContext("2d");

        // Membersihkan tabel
        tabel.innerHTML = "";

        // Menampilkan data lintasan ke tabel
        trajectory.forEach((data) => {
            const row = document.createElement("tr");

            const waktu = Number(data.t);
            const posisiX = Number(data.x);
            const posisiY = Number(data.y);

            row.innerHTML = `
                <td>${waktu.toFixed(2)}</td>
                <td>${posisiX.toFixed(2)}</td>
                <td>${posisiY.toFixed(2)}</td>
            `;

            tabel.appendChild(row);
        });

        // Mengatur ukuran canvas
        canvas.width = 900;
        canvas.height = 450;

        const width = canvas.width;
        const height = canvas.height;

        // Margin grafik
        const margin = {
            top: 30,
            right: 30,
            bottom: 60,
            left: 70
        };

        const grafikWidth = width - margin.left - margin.right;
        const grafikHeight = height - margin.top - margin.bottom;

        // Mengambil nilai maksimum X dan Y
        const maxX = Math.max(...trajectory.map(data => Number(data.x)));
        const maxY = Math.max(...trajectory.map(data => Number(data.y)));

        // Skala grafik
        const batasX = maxX > 0 ? maxX * 1.1 : 1;
        const batasY = maxY > 0 ? maxY * 1.2 : 1;

        // Konversi koordinat simulasi ke koordinat canvas
        function ubahX(x) {
            return margin.left + (Number(x) / batasX) * grafikWidth;
        }

        function ubahY(y) {
            return height - margin.bottom - (Number(y) / batasY) * grafikHeight;
        }

        // Membersihkan canvas
        ctx.clearRect(0, 0, width, height);

        // Background grafik
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // Menggambar grid
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;

        for (let i = 0; i <= 5; i++) {
            const x = margin.left + (grafikWidth / 5) * i;
            const y = margin.top + (grafikHeight / 5) * i;

            ctx.beginPath();
            ctx.moveTo(x, margin.top);
            ctx.lineTo(x, height - margin.bottom);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(margin.left, y);
            ctx.lineTo(width - margin.right, y);
            ctx.stroke();
        }

        // Menggambar sumbu X dan Y
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, height - margin.bottom);
        ctx.lineTo(width - margin.right, height - margin.bottom);
        ctx.stroke();

        // Label sumbu X
        ctx.fillStyle = "#333333";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";

        for (let i = 0; i <= 5; i++) {
            const nilaiX = (batasX / 5) * i;
            const posisi = margin.left + (grafikWidth / 5) * i;

            ctx.fillText(
                nilaiX.toFixed(1),
                posisi,
                height - margin.bottom + 25
            );
        }

        // Label sumbu Y
        ctx.textAlign = "right";

        for (let i = 0; i <= 5; i++) {
            const nilaiY = (batasY / 5) * i;
            const posisi = height - margin.bottom - (grafikHeight / 5) * i;

            ctx.fillText(
                nilaiY.toFixed(1),
                margin.left - 10,
                posisi + 5
            );
        }

        // Judul sumbu X
        ctx.textAlign = "center";
        ctx.font = "bold 15px Arial";

        ctx.fillText(
            "Jarak Horizontal (m)",
            margin.left + grafikWidth / 2,
            height - 10
        );

        // Judul sumbu Y
        ctx.save();

        ctx.translate(20, margin.top + grafikHeight / 2);
        ctx.rotate(-Math.PI / 2);

        ctx.fillText("Ketinggian (m)", 0, 0);

        ctx.restore();

        // Menggambar lintasan proyektil
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 3;

        ctx.beginPath();

        trajectory.forEach((data, index) => {
            const x = ubahX(data.x);
            const y = ubahY(data.y);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Titik awal
        ctx.fillStyle = "#16a34a";

        ctx.beginPath();
        ctx.arc(
            ubahX(trajectory[0].x),
            ubahY(trajectory[0].y),
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Titik akhir
        const titikAkhir = trajectory[trajectory.length - 1];

        ctx.fillStyle = "#dc2626";

        ctx.beginPath();
        ctx.arc(
            ubahX(titikAkhir.x),
            ubahY(titikAkhir.y),
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    } catch (error) {
        console.error("Gagal menampilkan grafik:", error);

        tabel.innerHTML = `
            <tr>
                <td colspan="3">
                    Data lintasan gagal ditampilkan.
                </td>
            </tr>
        `;
    }
}
