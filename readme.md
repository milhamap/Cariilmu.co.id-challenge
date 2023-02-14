<p align="center"><img src="https://cariilmu.co.id/images/logo-cariilmu-2021.png" width="100%"></p>

# Tutorial Github

## Forking dari Repository Utama

1. Buka Halaman [Repo](https://github.com/milhamap/Cariilmu.co.id-challenge.git)

2. Tekan Icon Fork

## Mengcloning Repository Hasil Forking

1. Buka Halaman Github Anda
 
2. Pilih Repository Hasil Forking

3. Pada Komputer Anda Buka Console / Command Promt

4. Ketikan Perintah Berikut

```
git clone https://github.com/milhamap/Cariilmu.co.id-challenge.git
```

4. Masuk Ke Dalam Folder Hasil Clone

```
cd Cariilmu.co.id challenge
```

# Tutorial Penggunaan & Konfigurasi Laravel

1. Install Node Package Manager Terlebih Dahulu <br>
   [Download disini](https://nodejs.org/en/download/)
2. Initialitation NPM Terlebih Dahulu

```
npm init --y
```

3. Copy isi file .env.example

```
cp .env.example .env
```

5. Buatlah database kosong di phpmyadmin dengan nama **db_course**
6. Lakukan Migrasi Database

```
knex migrate:latest
```

7. Jalankan aplikasi

```
npm run start
```