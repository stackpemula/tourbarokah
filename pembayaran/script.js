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

  // ❗ WAJIB URLSearchParams (bukan FormData)
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
      body: formData
    });

   const result = await res.text();
   console.log("HASIL:", result);
   alert(result);
   
    // WA routing
    let adminWA = "";

    if (desa === "Bayongbong") adminWA = "6285962359601";
    else if (desa === "Garut Barat") adminWA = "6282289614783";
    else if (desa === "Garut Timur") adminWA = "6282110075381";
    else if (desa === "Garut Utara") adminWA = "62852xxxx";

    const message =
`📩 KONFIRMASI PEMBAYARAN

Nama: ${nama}
WA: ${wa}
Kelompok: ${kelompok}
Jenjang: ${jenjang}
Desa: ${desa}`;

    window.open(`https://wa.me/${adminWA}?text=${encodeURIComponent(message)}`, "_blank");

    alert("Berhasil dikirim");
    form.reset();

  } catch (err) {
    console.log(err);
    alert("Gagal mengirim data");
  }

});