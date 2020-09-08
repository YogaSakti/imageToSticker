exports.textTnC = () => {
    return `
Source code / bot ini merupakan program open-source (gratis) yang ditulis menggunakan Javascript, kamu dapat menggunakan, menyalin, memodifikasi, menggabungkan, menerbitkan, mendistribusikan, mensublisensikan, dan atau menjual salinan dengan tanpa menghapus author utama dari source code / bot ini.

Dengan menggunakan source code / bot ini maka anda setuju dengan Syarat dan Kondisi sebagai berikut:
- Source code / bot tidak menyimpan data anda di server kami.
- Source code / bot tidak bertanggung jawab atas sticker yang anda buat dari bot ini serta video, gambar maupun data lainnya yang anda dapatkan dari Source code / bot ini.
- Source code / bot tidak boleh digunakan untuk layanan yang bertujuan/berkontribusi dalam: 
    • seks / perdagangan manusia
    • perjudian
    • perilaku adiktif yang merugikan 
    • kejahatan
    • kekerasan (kecuali jika diperlukan untuk melindungi keselamatan publik)
    • pembakaran hutan / penggundulan hutan
    • ujaran kebencian atau diskriminasi berdasarkan usia, jenis kelamin, identitas gender, ras, seksualitas, agama, kebangsaan

Source Code BOT : https://github.com/YogaSakti/imageToSticker
NodeJS WhatsApp library: https://github.com/open-wa/wa-automate-nodejs

Best regards, Yoga Sakti.`
}

exports.textMenu = (pushname) => {
    return `
Hi, ${pushname}! 👋️
Berikut adalah beberapa fitur yang ada pada bot ini!✨

Sticker Creator:
1. *#sticker*
Untuk merubah gambar menjadi sticker. (kirim gambar dengan caption #sticker atau balas gambar yang sudah dikirim dengan #sticker)

1. *#sticker*
Untuk merubah gambar menjadi sticker. (kirim gambar dengan caption #sticker atau balas gambar yang sudah dikirim dengan #sticker)

2. *#sticker* _<Url Gambar>_
Untuk merubah gambar dari url menjadi sticker. 

3. *#gifsticker* _<Giphy URL>_ / *#stickergif* _<Giphy URL>_
Untuk merubah gif menjadi sticker (Giphy Only)

Downloader:
1. *#tiktok* _<tiktol url> _
Untuk mengunduh video dari video tiktok.

2. *#fb* _<post/video url>_
Untuk mengunduh video dari Facebook.

3. *#ig* _<instagram post url>_
Untuk mengunduh photo dan video dari instagram.

4. *#twt* _<twitter post url>_
Untuk mengunduh photo dan video dari Twitter.

Lain-lain:
1. *#resi* _<kurir>_ _<nomer resi>_
Untuk memeriksa status pengiriman barang, daftar kurir: jne, pos, tiki, wahana, jnt, rpx, sap, sicepat, pcp, jet, dse, first, ninja, lion, idl, rex.

2. *#tnc*
Menampilkan Syarat dan Kondisi Bot.

3. *#donasi*
menampilkan informasi donasi.

Hope you have a great day!✨`
}

exports.textAdmin = () => {
    return `
⚠ [ *Admin Group Only* ] ⚠ 
Berikut adalah beberapa fitur admin grup yang ada pada bot ini!

1. *#kick* @user
Untuk mengeluarkan member dari grup (bisa lebih dari 1).

2. *#promote* @user
Untuk mempromosikan member menjadi Admin grup.

3. *#demote* @user
Untuk demosikan Admin grup.

4. *#tagall*
Untuk mention semua member grup. (Premium Only)

5. *#del*
Untuk menghapus pesan bot (balas pesan bot dengan #del)`
}

exports.textDonasi = () => {
    return `
Hai, terimakasih telah menggunakan bot ini, untuk mendukung bot ini kamu dapat membantu dengan berdonasi melalui link berikut:
1. Saweria: https://saweria.co/yogasakti
2. Trakteer: https://trakteer.id/red-emperor 

Donasi akan digunakan untuk pengembangan dan pengoperasian bot ini.

Terimakasih.`
}
