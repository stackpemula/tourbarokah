const scriptURL = "https://script.google.com/macros/s/AKfycbzwWUmvyBBDvNfKkohUbBWimHKvRUmrAx6iOLyc7hpLIYnT4VetdrUcEGiXsjwgQVqlrQ/exec";

const form = document.getElementById("paymentForm");

// ======================
// SUCCESS MODAL
// ======================
function showSuccessModal() {
  const modal = document.getElementById("successModal");
  modal.classList.add("show");
}

// ======================
// ERROR MODAL (opsional fallback)
// ======================
function showError(msg) {
  alert("❌ Gagal mengirim data:\n\n" + msg);
}

// ======================
// FORM SUBMIT
// ======================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const wa = document.getElementById("wa").value.trim();
  const desa = document.getElementById("desa").value;
  const kelompok = document.getElementById("kelompok").value.trim();
  const jenjang = document.getElementById("jenjang").value;
  const file = document.getElementById("bukti").files[0];

  // ======================
  // VALIDASI WA
  // ======================
  if (!wa.startsWith("08") && !wa.startsWith("628")) {
    alert("Nomor WhatsApp tidak valid!");
    return;
  }

  // ======================
  // VALIDASI FILE
  // ======================
  if (!file) {
    alert("Upload bukti transfer wajib!");
    return;
  }

  const button = form.querySelector("button");
  button.innerText = "Mengirim...";
  button.disabled = true;

  let controller = new AbortController();
  let timeout = setTimeout(() => controller.abort(), 20000); // 20 detik timeout

  try {

    // ======================
    // KONVERSI GAMBAR KE BASE64
    // ======================
    const fileData = await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });

    // ======================
    // KIRIM DATA
    // ======================
    const formData = new URLSearchParams();

    formData.append("nama", nama);
    formData.append("wa", wa);
    formData.append("desa", desa);
    formData.append("kelompok", kelompok);
    formData.append("jenjang", jenjang);

    formData.append("file", fileData);
    formData.append("fileName", file.name);

    // ======================
    // FETCH + TIMEOUT HANDLING
    // ======================
    const res = await fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeout);

    const result = await res.text();
    console.log("SERVER RESPONSE:", result);

    // ======================
    // VALIDASI RESPONSE SERVER
    // ======================
    if (!result || !result.includes("SUCCESS")) {
      throw new Error(result || "Response kosong dari server");
    }

    // ======================
    // ROUTING WA ADMIN
    // ======================
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
Pembayaran kamu sudah kami terima, silakan tunggu konfirmasi dari admin.`;

    // ======================
    // SUCCESS UI
    // ======================
    showSuccessModal();
    form.reset();

    // ======================
    // REDIRECT WA
    // ======================
    setTimeout(() => {
      window.location.href =
        `https://wa.me/${adminWA}?text=${encodeURIComponent(message)}`;
    }, 2000);

  } catch (err) {

    console.error("ERROR:", err);

    // ======================
    // 3 KEMUNGKINAN ERROR
    // ======================

    if (err.name === "AbortError") {
      showError("Request timeout (server terlalu lama merespon)");
    }
    else if (err.message.includes("FAILED") || err.message.includes("ERROR")) {
      showError("Server Apps Script error:\n" + err.message);
    }
    else {
      showError("Koneksi gagal / jaringan bermasalah");
    }

  } finally {

    clearTimeout(timeout);
    button.innerText = "Kirim Pembayaran";
    button.disabled = false;

  }

});