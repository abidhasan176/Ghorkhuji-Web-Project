import multer from "multer";

// Memory storage ব্যবহার করছি যাতে ফাইলগুলো প্রথমে RAM-এ সেভ হয়,
// কারণ আমরা এগুলো সরাসরি Cloudinary-তে আপলোড করব (Disk-এ রাখার দরকার নেই)।
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maximum 5MB per file
  fileFilter: (req, file, cb) => {
    // শুধু image file allow করা হচ্ছে
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"), false);
    }
  },
});

export default upload;
