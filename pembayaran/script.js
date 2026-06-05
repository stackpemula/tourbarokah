const scriptURL = "https://script.google.com/macros/s/AKfycbwzwKUJsKbXvE14Nl-hcPfWeZSwMjib6Sg7ZbT0CbQKXv4OPFdLh9Skx0nEGlcK2w5qFQ/exec";

const form = document.getElementById("paymentForm");

// ======================
// SUCCESS MODAL
// ======================
function showSuccessModal() {
  const modal = document.getElementById("successModal");
  modal.classList.add("show");
}

// ======================
// ERROR MODAL
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
    showError("Nomor WhatsApp tidak valid!");
    return;
  }

  // ======================
  // VALIDASI FILE
  // ======================
  if (!file) {
    showError("Upload bukti transfer wajib!");
    return;
  }

  const button = form.querySelector("button");
  button.innerText = "Mengirim...";
  button.disabled = true;

  let timeout = setTimeout(() => {
    showError("Server timeout (terlalu lama merespon)");
    button.innerText = "Kirim Pembayaran";
    button.disabled = false;
  }, 20000);

  try {

    // ======================
    // KONVERSI FILE → BASE64
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

    const res = await fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    });

    const result = await res.text();
    clearTimeout(timeout);

    console.log("SERVER RESPONSE:", result);

    // ======================
    // VALIDASI RESPONSE
    // ======================
    if (!result || !result.includes("SUCCESS")) {
      throw new Error(result || "Server tidak merespon SUCCESS");
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

    clearTimeout(timeout);
    console.error(err);

    showError("Error server / jaringan:\n" + err.message);

    button.innerText = "Kirim Pembayaran";
    button.disabled = false;
  }
});