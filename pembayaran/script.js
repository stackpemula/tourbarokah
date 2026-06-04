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
  const bukti = file ? file.name : "";

  // 🔐 VALIDASI NOMOR WA
  if (!wa.startsWith("08") && !wa.startsWith("628")) {
    alert("Nomor WhatsApp tidak valid! Gunakan format 08xxxx atau 628xxxx");
    return;
  }

  // 🔄 LOADING BUTTON
  const button = form.querySelector("button");
  button.innerText = "Mengirim...";
  button.disabled = true;

  // Kirim ke Google Sheets
  const formData = new URLSearchParams();
  formData.append("nama", nama);
  formData.append("wa", wa);
  formData.append("desa", desa);
  formData.append("kelompok", kelompok);
  formData.append("jenjang", jenjang);
  formData.append("bukti", bukti);

  try {
    const res = await fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    });

    const result = await res.text();

    console.log("RESPONSE:", result);
    alert("Server: " + result);

    // Routing admin WA
    let adminWA = "";

    if (desa === "Bayongbong") adminWA = "6285962359601";
    else if (desa === "Garut Barat") adminWA = "6282289614783";
    else if (desa === "Garut Timur") adminWA = "6281293143251";
    else if (desa === "Garut Utara") adminWA = "6281210759592";

    // Pesan WhatsApp
    const message = `📩 KONFIRMASI PEMBAYARAN

Nama: ${nama}
WA: ${wa}
Kelompok: ${kelompok}
Jenjang: ${jenjang}
Desa: ${desa}

Alhamdulillahi Jazakumullahu Khoiro 😊
Pembayaran kamu sudah kami terima, silakan tunggu konfirmasi dari admin.`;

    // Kirim ke WhatsApp
    window.open(
      `https://wa.me/${adminWA}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    alert("Data berhasil dikirim & diteruskan ke admin WhatsApp");
    form.reset();

  } catch (err) {
    console.log(err);
    alert("Gagal mengirim data");
  } finally {
    // 🔁 KEMBALIKAN BUTTON NORMAL
    button.innerText = "Kirim Pembayaran";
    button.disabled = false;
  }
});