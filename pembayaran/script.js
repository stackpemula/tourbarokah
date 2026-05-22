const scriptURL =
"https://script.google.com/macros/s/AKfycbwrzIvEnIfJ9Uy7Ow9xbx_40yw_V7S59GqyyJiKqG-AjFj4G7zPXf-MVsFqeghDNeP-gw/exec";

const form = document.getElementById("paymentForm");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const nama =
    document.getElementById("nama").value;

  const wa =
    document.getElementById("wa").value;

  const desa =
    document.getElementById("desa").value;

  const kelompok =
    document.getElementById("kelompok").value;

  const jenjang =
    document.getElementById("jenjang").value;

  const buktiInput =
    document.getElementById("bukti");

  const file =
    buktiInput.files[0];

  const bukti =
    file ? file.name : "";

  // FORM DATA

  const formData = new URLSearchParams();

  formData.append("nama", nama);
  formData.append("wa", wa);
  formData.append("desa", desa);
  formData.append("kelompok", kelompok);
  formData.append("jenjang", jenjang);
  formData.append("bukti", bukti);

  try {

    // KIRIM KE SPREADSHEET

    await fetch(scriptURL, {
      method: "POST",
      body: formData
    });

    // ADMIN WA

    let adminWA = "";

    if (desa === "Bayongbong") {
      adminWA = "6285962359601";
    }

    else if (desa === "Garut Barat") {
      adminWA = "6282289614783";
    }

    else if (desa === "Garut Timur") {
      adminWA = "6282110075381";
    }

    else if (desa === "Garut Utara") {
      adminWA = "62852xxxx";
    }

    // PESAN

    const message =
`Assalamu'alaikum Admin ${desa}

Saya sudah melakukan pembayaran Tour Pondok Pesantren.

Nama: ${nama}
No WA: ${wa}
Kelompok: ${kelompok}
Jenjang: ${jenjang}

Alhamdulillahi Jazakumullahu Khoiro.`;

    // WHATSAPP

    const whatsappURL =
`https://wa.me/${adminWA}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");

    alert("Pembayaran berhasil dikirim");

    form.reset();

  } catch(error) {

    console.log(error);

    alert("Terjadi kesalahan");
  }

});