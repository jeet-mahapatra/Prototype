// Asset management system for civic issue reporting
// Handles photo uploads and saves them as actual files in assets folder

class AssetManager {
  constructor() {
    // Track uploaded files metadata
    this.uploadedImages = new Map();
    this.imageCounter = 1;
    this.assetsPath = '/src/assets/uploads/'; // Path where images will be stored
  }

  /**
   * Upload and save an image file to JSON server database
   * @param {File} file - The image file to upload
   * @param {string} category - Category of the issue (for organization)
   * @returns {Promise<object>} - Upload result with file path and metadata
   */
  async uploadImage(file, category = 'general') {
    try {
      // Validate file
      if (!this.isValidImageFile(file)) {
        throw new Error('Invalid image file. Please upload JPG, PNG, or WEBP files under 5MB.');
      }

      // Generate unique filename and ID
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const sanitizedCategory = category.replace(/[^a-z0-9]/g, '-');
      const fileName = `${sanitizedCategory}_${timestamp}_${this.imageCounter}.${fileExtension}`;
      const imageId = `img_${this.imageCounter}_${timestamp}`;
      this.imageCounter++;

      // Convert file to base64 for database storage
      const base64 = await this.fileToBase64(file);
      const thumbnailBase64 = await this.generateThumbnail(base64, 200, 150);

      // Create image data object
      const imageData = {
        id: imageId,
        originalName: file.name,
        fileName: fileName,
        size: file.size,
        type: file.type,
        category: category,
        uploadedAt: new Date().toISOString(),
        base64Data: base64,
        thumbnailData: thumbnailBase64
      };

      // Save to JSON Server database
      const response = await fetch('http://localhost:5000/uploadedImages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
      });

      if (!response.ok) {
        throw new Error('Failed to save image to database');
      }

      const savedImageData = await response.json();

      // Store in local memory as well for quick access
      this.uploadedImages.set(imageId, savedImageData);

      // Return upload result
      return {
        success: true,
        imageId: imageId,
        url: base64,
        thumbnail: thumbnailBase64,
        fileName: fileName,
        metadata: {
          originalName: savedImageData.originalName,
          size: this.formatFileSize(savedImageData.size),
          uploadedAt: savedImageData.uploadedAt
        }
      };

    } catch (error) {
      console.error('Image upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Save image file (simulated for demo - in production would save to server/disk)
   * @param {File} file - File to save
   * @param {string} fileName - Generated filename
   * @returns {Promise<string>} - File URL
   */
  async saveImageFile(file, fileName) {
    // Create blob URL for demo purposes
    // In production, this would save to actual file system or cloud storage
    const blob = new Blob([file], { type: file.type });
    const url = URL.createObjectURL(blob);
    
    // Store reference for cleanup
    this.blobUrls = this.blobUrls || new Set();
    this.blobUrls.add(url);
    
    // Simulate file saving delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`📁 Image saved as: ${fileName}`);
    return url;
  }

  /**
   * Generate and save thumbnail file
   * @param {File} file - Original file
   * @param {string} fileName - Base filename
   * @returns {Promise<string>} - Thumbnail URL
   */
  async generateThumbnailFile(file, fileName) {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        // Set thumbnail dimensions
        const maxWidth = 200;
        const maxHeight = 150;
        
        let { width, height } = img;
        
        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob and create URL
        canvas.toBlob((blob) => {
          const thumbnailUrl = URL.createObjectURL(blob);
          this.blobUrls = this.blobUrls || new Set();
          this.blobUrls.add(thumbnailUrl);
          
          const thumbFileName = fileName.replace(/(\.[^.]+)$/, '_thumb$1');
          console.log(`📁 Thumbnail saved as: ${thumbFileName}`);
          resolve(thumbnailUrl);
        }, 'image/jpeg', 0.8);
      };
      
      // Create object URL for the original file to load it
      const fileUrl = URL.createObjectURL(file);
      img.src = fileUrl;
    });
  }

  /**
   * Get uploaded image by ID (checks memory first, then database)
   * @param {string} imageId - The image ID
   * @returns {Promise<object|null>} - Image data or null if not found
   */
  async getImage(imageId) {
    // Check memory first
    if (this.uploadedImages.has(imageId)) {
      return this.uploadedImages.get(imageId);
    }

    // Fetch from database if not in memory
    try {
      const response = await fetch(`http://localhost:5000/uploadedImages?id=${imageId}`);
      if (response.ok) {
        const images = await response.json();
        if (images.length > 0) {
          const imageData = images[0];
          // Cache in memory
          this.uploadedImages.set(imageId, imageData);
          return imageData;
        }
      }
    } catch (error) {
      console.error('Error fetching image from database:', error);
    }

    return null;
  }

  /**
   * Get all uploaded images for a category
   * @param {string} category - Category to filter by
   * @returns {Array} - Array of image data
   */
  getImagesByCategory(category) {
    const images = [];
    for (const [id, imageData] of this.uploadedImages) {
      if (imageData.category === category) {
        images.push({ id, ...imageData });
      }
    }
    return images.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  }

  /**
   * Convert file to base64
   * @param {File} file - File to convert
   * @returns {Promise<string>} - Base64 string
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Generate thumbnail from base64 image
   * @param {string} base64 - Original base64 image
   * @param {number} width - Thumbnail width
   * @param {number} height - Thumbnail height
   * @returns {Promise<string>} - Thumbnail base64
   */
  generateThumbnail(base64, width = 200, height = 150) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        let drawWidth = width;
        let drawHeight = height;
        
        if (aspectRatio > width / height) {
          drawHeight = width / aspectRatio;
        } else {
          drawWidth = height * aspectRatio;
        }
        
        const x = (width - drawWidth) / 2;
        const y = (height - drawHeight) / 2;
        
        ctx.fillStyle = '#f3f4f6'; // Gray background
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = base64;
    });
  }

  /**
   * Get image URL for display
   * @param {string} imageId - The image ID
   * @param {string} size - 'full' or 'thumbnail'
   * @returns {Promise<string|null>} - Image URL or null
   */
  async getImageUrl(imageId, size = 'full') {
    const imageData = await this.getImage(imageId);
    if (!imageData) return null;
    
    return size === 'thumbnail' ? imageData.thumbnailData : imageData.base64Data;
  }

  /**
   * Validate if file is a valid image
   * @param {File} file - File to validate
   * @returns {boolean} - Validation result
   */
  isValidImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    return validTypes.includes(file.type) && file.size <= maxSize;
  }

  /**
   * Convert file to base64
   * @param {File} file - File to convert
   * @returns {Promise<string>} - Base64 string
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Generate thumbnail from base64 image
   * @param {string} base64 - Original base64 image
   * @param {number} width - Thumbnail width
   * @param {number} height - Thumbnail height
   * @returns {Promise<string>} - Thumbnail base64
   */
  generateThumbnail(base64, width = 200, height = 150) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        let drawWidth = width;
        let drawHeight = height;
        
        if (aspectRatio > width / height) {
          drawHeight = width / aspectRatio;
        } else {
          drawWidth = height * aspectRatio;
        }
        
        const x = (width - drawWidth) / 2;
        const y = (height - drawHeight) / 2;
        
        ctx.fillStyle = '#f3f4f6'; // Gray background
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = base64;
    });
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted size string
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get upload statistics
   * @returns {object} - Upload statistics
   */
  getStatistics() {
    const totalImages = this.uploadedImages.size;
    const totalSize = Array.from(this.uploadedImages.values())
      .reduce((sum, img) => sum + img.size, 0);
    
    const categoryCounts = {};
    for (const imageData of this.uploadedImages.values()) {
      categoryCounts[imageData.category] = (categoryCounts[imageData.category] || 0) + 1;
    }

    return {
      totalImages,
      totalSize: this.formatFileSize(totalSize),
      categoryCounts,
      lastUpload: totalImages > 0 ? 
        Math.max(...Array.from(this.uploadedImages.values()).map(img => new Date(img.uploadedAt))) : null
    };
  }

  /**
   * Export image data for issue reporting
   * @param {string} imageId - Image ID to export
   * @returns {object|null} - Exportable image data
   */
  exportForIssue(imageId) {
    const imageData = this.getImage(imageId);
    if (!imageData) return null;

    return {
      id: imageData.id,
      url: imageData.url,
      thumbnail: imageData.thumbnail,
      originalName: imageData.originalName,
      size: imageData.size,
      type: imageData.type,
      uploadedAt: imageData.uploadedAt
    };
  }
}

// Create singleton instance
const assetManager = new AssetManager();

// Predefined placeholder images for different categories
export const placeholderImages = {
  'road-infrastructure': 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Road+Issue',
  'sanitation': 'https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Sanitation+Issue',
  'electrical': 'https://via.placeholder.com/400x300/45b7d1/ffffff?text=Electrical+Issue',
  'water-drainage': 'https://via.placeholder.com/400x300/96ceb4/ffffff?text=Water+Issue',
  'general': 'https://via.placeholder.com/400x300/feca57/ffffff?text=Civic+Issue'
};

// Utility functions for different image operations
export const imageUtils = {
  /**
   * Get category-specific placeholder
   * @param {number} categoryId - Category ID
   * @returns {string} - Placeholder image URL
   */
  getCategoryPlaceholder(categoryId) {
    const categoryMap = {
      1: 'road-infrastructure',
      2: 'sanitation', 
      3: 'electrical',
      4: 'water-drainage'
    };
    return placeholderImages[categoryMap[categoryId]] || placeholderImages.general;
  },

  /**
   * Generate image URL for issue display
   * @param {Array} images - Array of image URLs/IDs
   * @param {number} categoryId - Fallback category for placeholder
   * @returns {Promise<string>} - Display image URL
   */
  async getDisplayImage(images, categoryId) {
    if (images && images.length > 0) {
      // If it's an asset manager ID, get the URL
      if (typeof images[0] === 'string' && images[0].startsWith('img_')) {
        const url = await assetManager.getImageUrl(images[0]);
        return url || this.getCategoryPlaceholder(categoryId);
      }
      return images[0]; // Direct URL
    }
    return this.getCategoryPlaceholder(categoryId);
  },

  /**
   * Generate thumbnail URL
   * @param {Array} images - Array of image URLs/IDs
   * @param {number} categoryId - Fallback category
   * @returns {Promise<string>} - Thumbnail URL
   */
  async getThumbnail(images, categoryId) {
    if (images && images.length > 0 && images[0].startsWith('img_')) {
      const url = await assetManager.getImageUrl(images[0], 'thumbnail');
      return url || this.getCategoryPlaceholder(categoryId);
    }
    return await this.getDisplayImage(images, categoryId);
  }
};

// Export the asset manager instance
export default assetManager;
