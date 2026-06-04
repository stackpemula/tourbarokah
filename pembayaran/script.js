const scriptURL = "https://script.google.com/macros/s/AKfycbw06Wsz8Jpwf77sD0mP-qv2yXEVabIchFARB4qxSlohIsuSmIk2iB8oPvW0HbVcX0oE/exec";

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
  const file = document.getElementById("bukti").files[0];

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

  // ======================
  // BUKA TAB WA LEBIH AWAL
  // ======================

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

    // ======================
    // VALIDASI RESPONSE
    // ======================

    if (!result.includes("SUCCESS")) {
      throw new Error(result);
    }

    // ======================
    // ROUTING ADMIN WA
    // ======================

    let adminWA = "";

    if (desa === "Bayongbong") {
      adminWA = "6285962359601";
    }
    else if (desa === "Garut Barat") {
      adminWA = "6282289614783";
    }
    else if (desa === "Garut Timur") {
      adminWA = "6281293143251";
    }
    else if (desa === "Garut Utara") {
      adminWA = "6281210759592";
    }

    // ======================
    // PESAN WA
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
    // TAMPILKAN ANIMASI SUKSES
    // ======================

    showSuccessModal();

    // ======================
    // REDIRECT WA SETELAH 2 DETIK
    // ======================

    setTimeout(() => {

      if (waWindow) {
        waWindow.location.href =
          `https://wa.me/${adminWA}?text=${encodeURIComponent(message)}`;
      }

      form.reset();

    }, 2000);

  }

  catch (err) {

    console.error(err);

    if (waWindow) {
      waWindow.close();
    }

    alert("Gagal mengirim data.\n\n" + err.message);

  }

  finally {

    button.innerText = "Kirim Pembayaran";
    button.disabled = false;

  }

});