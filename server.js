const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const ADMIN_PASSWORD = 'смени_меня_123'; // ← поменяй!

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, 'program.exe') // всегда одно имя
});
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 МБ
  fileFilter: (req, file, cb) => {
    if (!file.originalname.toLowerCase().endsWith('.exe'))
      return cb(new Error('Только .exe'));
    cb(null, true);
  }
});

app.use(express.static('public'));
app.use('/download', express.static('uploads'));

// Загрузка (только с паролем)
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.headers['x-password'] !== ADMIN_PASSWORD)
    return res.status(403).send('Неверный пароль');
  res.send('OK');
});

app.listen(3000, () => console.log('http://localhost:3000'));