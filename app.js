import express from "express";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bodyParser from "body-parser";
import router from './routes/myrouters.js';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ตั้งค่าไฟล์ static
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));

// ตั้งค่าไดเรกทอรีที่เก็บไฟล์ views
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ใช้ router
app.use('/', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
