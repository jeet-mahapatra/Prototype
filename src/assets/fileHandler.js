// File upload utilities for saving images to assets folder
// This would typically run on a Node.js server

import fs from 'fs';
import path from 'path';

export class FileUploadHandler {
  constructor() {
    this.uploadDir = path.join(process.cwd(), 'src', 'assets', 'uploads');
    this.ensureUploadDir();
  }

  /**
   * Ensure upload directory exists
   */
  ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Save uploaded file to assets folder
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} fileName - Generated filename
   * @returns {Promise<string>} - Saved file path
   */
  async saveFile(fileBuffer, fileName) {
    try {
      const filePath = path.join(this.uploadDir, fileName);
      
      await fs.promises.writeFile(filePath, fileBuffer);
      
      console.log(`✅ File saved: ${fileName}`);
      return filePath;
    } catch (error) {
      console.error('❌ File save error:', error);
      throw new Error(`Failed to save file: ${error.message}`);
    }
  }

  /**
   * Delete uploaded file
   * @param {string} fileName - Filename to delete
   * @returns {Promise<boolean>} - Success status
   */
  async deleteFile(fileName) {
    try {
      const filePath = path.join(this.uploadDir, fileName);
      
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log(`🗑️ File deleted: ${fileName}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ File delete error:', error);
      return false;
    }
  }

  /**
   * Get file info
   * @param {string} fileName - Filename
   * @returns {object|null} - File stats or null
   */
  getFileInfo(fileName) {
    try {
      const filePath = path.join(this.uploadDir, fileName);
      
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        return {
          fileName,
          filePath,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      }
      
      return null;
    } catch (error) {
      console.error('❌ File info error:', error);
      return null;
    }
  }

  /**
   * List all uploaded files
   * @returns {Array} - Array of file info objects
   */
  listFiles() {
    try {
      const files = fs.readdirSync(this.uploadDir);
      return files
        .filter(file => !file.startsWith('.') && file !== 'README.md')
        .map(file => this.getFileInfo(file))
        .filter(info => info !== null);
    } catch (error) {
      console.error('❌ List files error:', error);
      return [];
    }
  }

  /**
   * Clean up old files (optional - for maintenance)
   * @param {number} daysOld - Delete files older than this many days
   * @returns {Promise<number>} - Number of files deleted
   */
  async cleanupOldFiles(daysOld = 30) {
    try {
      const files = this.listFiles();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      let deletedCount = 0;
      
      for (const fileInfo of files) {
        if (fileInfo.created < cutoffDate) {
          const deleted = await this.deleteFile(fileInfo.fileName);
          if (deleted) deletedCount++;
        }
      }
      
      console.log(`🧹 Cleanup completed: ${deletedCount} files deleted`);
      return deletedCount;
    } catch (error) {
      console.error('❌ Cleanup error:', error);
      return 0;
    }
  }
}

// Example usage in an Express.js route:
/*
import express from 'express';
import multer from 'multer';

const router = express.Router();
const fileHandler = new FileUploadHandler();

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Upload endpoint
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const timestamp = Date.now();
    const category = req.body.category || 'general';
    const extension = req.file.originalname.split('.').pop();
    const fileName = `${category}_${timestamp}_${Math.floor(Math.random() * 1000)}.${extension}`;

    const filePath = await fileHandler.saveFile(req.file.buffer, fileName);
    
    res.json({
      success: true,
      fileName,
      filePath: `/assets/uploads/${fileName}`,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
*/

export default FileUploadHandler;
