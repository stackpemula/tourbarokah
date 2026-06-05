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
// FORM SUBMIT
// ======================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const wa = document.getElementById("wa").value.trim();
  const desa = document.getElementById("desa").value;
  const kelompok = document.getElementById("kelompok").value.trim();
  const jenjang = document.getElementById("jenjang").value;

  // ======================
  // VALIDASI WA
  // ======================
  if (!wa.startsWith("08") && !wa.startsWith("628")) {
    alert("Nomor WhatsApp tidak valid!\nGunakan format 08xxxxxxxxxx atau 628xxxxxxxxxx");
    return;
  }

  // ======================
  // LOADING BUTTON
  // ======================
  const button = form.querySelector("button");
  button.innerText = "Mengirim...";
  button.disabled = true;

  try {

    // ======================
    // KIRIM DATA KE APPS SCRIPT
    // ======================
    const formData = new URLSearchParams();

    formData.append("nama", nama);
    formData.append("wa", wa);
    formData.append("desa", desa);
    formData.append("kelompok", kelompok);
    formData.append("jenjang", jenjang);

    const res = await fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    });

    const result = await res.text();
    console.log("SERVER RESPONSE:", result);

    // ======================
    // VALIDASI RESPONSE
    // ======================
    if (!result.includes("SUCCESS")) {
      throw new Error(result);
    }

    // ======================
    // ROUTING WA ADMIN
    // ======================
    let adminWA = "";

    if (desa === "Bayongbong") adminWA = "6285962359601";
    else if (desa === "Garut Barat") adminWA = "6282289614783";
    else if (desa === "Garut Timur") adminWA = "6281293143251";
    else if (desa === "Garut Utara") adminWA = "6281210759592";

    // ======================
    // PESAN WHATSAPP
    // ======================
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
    // REDIRECT WHATSAPP
    // ======================
    setTimeout(() => {
      window.location.href =
        `https://wa.me/${adminWA}?text=${encodeURIComponent(message)}`;
    }, 2000);

  } catch (err) {

    console.error(err);
    alert("Gagal mengirim data:\n\n" + err.message);

  } finally {

    button.innerText = "Kirim Pembayaran";
    button.disabled = false;

  }
});