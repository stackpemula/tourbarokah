const scriptURL = "https://script.google.com/macros/s/AKfycbw06Wsz8Jpwf77sD0mP-qv2yXEVabIchFARB4qxSlohIsuSmIk2iB8oPvW0HbVcX0oE/exec";

const form = document.getElementById("paymentForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const wa = document.getElementById("wa").value;
  const desa = document.getElementById("desa").value;
  const kelompok = document.getElementById("kelompok").value;
  const jenjang = document.getElementById("jenjang").value;

  const file = document.getElementById("bukti").files[0];

  // 🔐 VALIDASI WA
  if (!wa.startsWith("08") && !wa.startsWith("628")) {
    alert("Nomor WhatsApp tidak valid!");
    return;
  }

  // 🔄 LOADING
  const button = form.querySelector("button");
  button.innerText = "Mengirim...";
  button.disabled = true;

  // 🚀 Buka tab kosong lebih awal agar tidak diblokir browser
  let waWindow = window.open("", "_blank");

  try {
    const formData = new FormData();

    formData.append("nama", nama);
    formData.append("wa", wa);
    formData.append("desa", desa);
    formData.append("kelompok", kelompok);
    formData.append("jenjang", jenjang);

    if (file) {
      formData.append("file", file);
    }

    const res = await fetch(scriptURL, {
      method: "POST",
      body: formData
    });

    const result = await res.text();

    console.log("RESPONSE:", result);

    // ❗ hanya lanjut jika server sukses
    if (!result.includes("SUCCESS")) {
      throw new Error(result);
    }

    // WA routing
    let adminWA = "";

    if (desa === "Bayongbong") adminWA = "6285962359601";
    else if (desa === "Garut Barat") adminWA = "6282289614783";
    else if (desa === "Garut Timur") adminWA = "6281293143251";
    else if (desa === "Garut Utara") adminWA = "6281210759592";

    const message = `📩 KONFIRMASI PEMBAYARAN

Nama: ${nama}
WA: ${wa}
Kelompok: ${kelompok}
Jenjang: ${jenjang}
Desa: ${desa}

Alhamdulillahi Jazakumullahu Khoiro 😊
Pembayaran kamu sudah kami terima, silakan tunggu konfirmasi admin.`;

    // 🚀 Arahkan tab yang sudah dibuka ke WhatsApp
    if (waWindow) {
      waWindow.location.href =
        `https://wa.me/${adminWA}?text=${encodeURIComponent(message)}`;
    }

    alert("Data berhasil dikirim.");
    form.reset();

  } catch (err) {
    console.error(err);

    // tutup tab kosong jika gagal
    if (waWindow) {
      waWindow.close();
    }

    alert("Gagal mengirim data: " + err.message);
  } finally {
    button.innerText = "Kirim Pembayaran";
    button.disabled = false;
  }
});