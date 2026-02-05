const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. KONEKSI MYSQL (Sesuaikan dengan Laragon)
// Default Laragon: user 'root' dan password kosong ''
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pb'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Backend terkoneksi ke MySQL XAMPP!');
});

// 2. READ (GET)
app.get('/api/mahasiswa', (req, res) => {
    db.query('SELECT * FROM mahasiswa ORDER BY id DESC', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 3. CREATE (POST)
app.post('/api/mahasiswa', (req, res) => {
    const { nama, jurusan } = req.body;
    db.query('INSERT INTO mahasiswa (nama, jurusan) VALUES (?, ?)', [nama, jurusan], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Data berhasil ditambahkan', id:
        result.insertId });
    });
});

// 4. UPDATE (PUT)
app.put('/api/mahasiswa/:id', (req, res) => {
    const id = req.params.id;
    const { nama, jurusan } = req.body;
    db.query('UPDATE mahasiswa SET nama=?, jurusan=? WHERE id=?', [nama, jurusan, id], (err) => {
        if (err) throw err;
        res.json({ message: 'Data berhasil diupdate' });
        });
});

// 5. DELETE (DELETE)
app.delete('/api/mahasiswa/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM mahasiswa WHERE id=?', [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Data berhasil dihapus' });
    });
});

app.listen(3000, () => console.log('Server CRUD aktif di port 3000'));