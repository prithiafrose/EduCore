const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_EXTENSIONS = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
    ".txt",
    ".zip",
    ".rar",
    ".7z",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
];

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}`;
        const ext = path.extname(file.originalname) || "";
        cb(null, `${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return cb(new Error("Unsupported file type"));
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 },
});

const streamFile = (res, filePath, name) => {
    const safeName = path.basename(filePath || "");
    const absolute = path.join(uploadDir, safeName);

    if (!safeName || !fs.existsSync(absolute)) {
        return res.status(404).json({ message: "File not found" });
    }

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(
            name || safeName
        )}"`
    );

    return res.sendFile(absolute);
};

module.exports = { upload, uploadDir, streamFile };