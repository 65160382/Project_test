import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import path from 'path'; 

const router = express.Router();

// ตัวแปร blogList
let blogList = [];

const __dirname = dirname(fileURLToPath(import.meta.url));

// กำหนดเส้นทางของไฟล์ EJS
const indexPath = join(__dirname, '../views/index.ejs');
const homePath = join(__dirname, '../views/blogList.ejs');
const blogDetailsPath = join(__dirname, '../views/BlogDetails.ejs');

// ตั้งค่า multer สำหรับการอัพโหลดไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// routing
router.get("/", (req, res) => {
  res.render(indexPath);
});

router.get("/home", (req, res) => {
  res.render(homePath, { blogList: blogList }); // ส่งตัวแปร blogList ไปยัง view
});

router.post("/home", upload.single('blogImage'), (req, res) => {
  const blogTitle = req.body.blogTitle;
  const blogDescription = req.body.blogDes;
  const blogImage = req.file ? `/uploads/${req.file.filename}` : '';

  blogList.push({
    id: generateID(),
    title: blogTitle,
    description: blogDescription,
    image: blogImage
  });

  res.render(homePath, {
    blogList: blogList,
  });
});

// Function to generate random ID
function generateID() {
  return Math.floor(Math.random() * 10000);
}

// Render blog details page
router.get("/blogDetails/:id", (req, res) => {
  const blogId = req.params.id;
  const blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
  if (!blogDetails) {
    return res.send("<h1> Blog not found </h1>");
  }
  res.render(blogDetailsPath, {
    blogDetails: blogDetails,
  });
});

// Update blog
router.get("/edit/:id", (req, res) => {
  const blogId = req.params.id;
  const blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
  if (!blogDetails) {
    return res.send("<h1> Blog not found </h1>");
  }
  res.render('editBlog', {
    blogDetails: blogDetails,
  });
});

router.post("/edit/:id", (req, res) => {
  const blogId = req.params.id;
  const editBlog = blogList.findIndex((blog) => blog.id === parseInt(blogId));
  if (editBlog === -1) {
    return res.send("<h1> Something went wrong </h1>");
  }
  const updatedTitle = req.body.blogTitle;
  const updatedDescription = req.body.blogDes;

  blogList[editBlog].title = updatedTitle;
  blogList[editBlog].description = updatedDescription;

  res.render(homePath, {
    isEdit: true,
    blogList: blogList,
  });
});

router.post("/delete/:id", (req, res) => {
  const blogId = req.params.id;
  blogList = blogList.filter((blog) => blog.id !== parseInt(blogId));
  res.send(
    '<script>alert("Blog deleted successfully"); window.location="/home";</script>'
  );
});

export default router;
