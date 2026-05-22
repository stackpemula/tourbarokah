const scriptURL = "https://script.google.com/macros/s/AKfycbwrzIvEnIfJ9Uy7Ow9xbx_40yw_V7S59GqyyJiKqG-AjFj4G7zPXf-MVsFqeghDNeP-gw/exec";

const form = document.getElementById("paymentForm");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  // AMBIL DATA

  const nama = document.getElementById("nama").value;
  const wa = document.getElementById("wa").value;
  const desa = document.getElementById("desa").value;
  const kelompok = document.getElementById("kelompok").value;
  const jenjang = document.getElementById("jenjang").value;

  const buktiInput =
    document.getElementById("bukti");

  const file = buktiInput.files[0];

  // sementara simpan nama file

  const bukti = file ? file.name : "";

  // FORM DATA

  const formData = new URLSearchParams();

  formData.append("nama", nama);
  formData.append("wa", wa);
  formData.append("desa", desa);
  formData.append("kelompok", kelompok);
  formData.append("jenjang", jenjang);
  formData.append("bukti", bukti);

  try{

    // KIRIM KE APPS SCRIPT

    await fetch(scriptURL,{
      method:"POST",
      body:formData
    });

    // NOMOR ADMIN BERDASARKAN WILAYAH

    let adminWA = "";

    if(desa === "Bayongbong"){
    adminWA = "6285962359601";
    }

    else if(desa === "Garut Barat"){
    adminWA = "6282289614783";
    }

    else if(desa === "Garut Timur"){
    adminWA = "6282110075381";
    }

    else if(desa === "Garut Utara"){
    adminWA = "628xxxxxxxxxx";
    }
    // PESAN OTOMATIS

    const message =
`Assalamu'alaikum min ${desa}

Saya sudah melakukan pembayaran Tour Pondok Pesantren.

Nama: ${nama}
No WA: ${wa}
Kelompok: ${kelompok}
Jenjang: ${jenjang}

Alhamdulillahi Jazakumullahu Khoiro.`;

    // LINK WHATSAPP

    const whatsappURL =
`https://wa.me/${adminWA}?text=${encodeURIComponent(message)}`;

    // BUKA WHATSAPP

    window.open(whatsappURL, "_blank");

    alert("Pembayaran berhasil dikirim");

    form.reset();

  }catch(error){

    alert("Terjadi kesalahan");
  }

});