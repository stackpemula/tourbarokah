const scriptURL = 'https://script.google.com/macros/s/AKfycbw9SqxHTRQV9ziSL-47EcQy9APC-EjCY1Cn7rlLn4VZFwfxbUqjQWzN_Pj9XazD-MzboQ/exec';

const form = document.getElementById('form');
const status = document.getElementById('status');

/* SUBMIT FORM */

if(form){

  form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const data = {
      nama: document.getElementById('nama').value,
      jenisKelamin: document.getElementById('jenisKelamin').value,
      umur: document.getElementById('umur').value,
      desa: document.getElementById('desa').value,
      kelompok: document.getElementById('kelompok').value,
      nohp: document.getElementById('nohp').value
    };

    status.innerText = 'Mengirim data...';

    try {

      await fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      status.innerText = 'Pendaftaran berhasil!';

      form.reset();

      loadTotalPeserta();

    } catch (error) {

      status.innerText = 'Terjadi kesalahan!';

      console.log(error);

    }

  });

}

/* TOTAL PESERTA */

async function loadTotalPeserta(){

  try{

    const response = await fetch(scriptURL);

    const result = await response.json();

    console.log(result);

    const totalPeserta =
      document.getElementById('totalPeserta');

    if(totalPeserta){

      totalPeserta.innerText =
        result.length + ' Peserta';

    }

  }

  catch(error){

    console.log(error);

  }

}

loadTotalPeserta();