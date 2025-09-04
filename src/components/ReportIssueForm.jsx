import { useState, useEffect } from "react";
import assetManager, { imageUtils } from "../assets/assets.js";
import { useAuthContext } from "../context/AuthContext";
import { useIssuesContext } from "../context/IssuesContext";

function ReportIssueForm() {
  const { user } = useAuthContext();
  const { createIssue } = useIssuesContext();
  const [categories, setCategories] = useState([]);
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    subcategory: "",
    address: "",
    priority: "medium",
    image: null
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    
    try {
      // Get category name for file organization
      const categoryName = selectedCategory?.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'general';
      
      // Upload image using asset manager - this will save the file to assets/uploads/
      console.log(`📤 Uploading ${file.name} to assets/uploads/ folder...`);
      const result = await assetManager.uploadImage(file, categoryName);
      
      if (result.success) {
        console.log(`✅ Image saved as: ${result.fileName}`);
        console.log(`📁 File path: ${result.filePath}`);
        
        setUploadedImage(result);
        setFormData({
          ...formData,
          image: result.imageId
        });
        
        // Show success notification
        alert(`✅ Photo uploaded successfully!\nSaved as: ${result.fileName}`);
      } else {
        alert(`❌ Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('❌ Failed to upload image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  const removeUploadedImage = async () => {
    if (uploadedImage) {
      await assetManager.deleteImage(uploadedImage.imageId);
      setUploadedImage(null);
      setFormData({
        ...formData,
        image: null
      });
    }
  };

  const handleCategoryChange = (categoryId) => {
    const category = categories.find(cat => cat.id === parseInt(categoryId));
    setSelectedCategory(category);
    setFormData({
      ...formData,
      categoryId: categoryId,
      subcategory: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to report an issue');
      return;
    }
    
    // Mock location coordinates (in real app, would use GPS)
    const mockLocations = [
      { lat: 23.3441, lng: 85.3096 }, // Ranchi
      { lat: 23.7957, lng: 86.4304 }, // Dhanbad  
      { lat: 23.3629, lng: 85.3222 }  // Station Road
    ];
    const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];

    const newIssue = {
      userId: user.id,
      title: formData.title,
      description: formData.description,
      categoryId: parseInt(formData.categoryId),
      subcategory: formData.subcategory,
      location: formData.address,
      latitude: randomLocation.lat,
      longitude: randomLocation.lng,
      imageId: uploadedImage ? uploadedImage.imageId : null,
      priority: formData.priority,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const result = await createIssue(newIssue);
      if (result.success) {
        // Reset form
        setFormData({
          title: "",
          description: "",
          categoryId: "",
          subcategory: "",
          address: "",
          priority: "medium",
          image: null
        });
        setUploadedImage(null);
        setSelectedCategory(null);
        alert('Issue reported successfully!');
      } else {
        alert('Failed to report issue: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('Failed to report issue. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief description of the issue"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          {selectedCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Issue Type *
              </label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select specific issue</option>
                {selectedCategory.subcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Provide detailed description of the issue"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address, landmark, area name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              📍 GPS location will be automatically captured
            </p>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low - Minor inconvenience</option>
              <option value="medium">Medium - Affects daily life</option>
              <option value="high">High - Safety hazard/urgent</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo (Optional)
            </label>
            
            {!uploadedImage ? (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
                {imageUploading && (
                  <div className="flex items-center text-blue-600 text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Saving image to assets/uploads/ folder...
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  📸 Photo helps authorities understand the issue better (Max: 5MB, JPG/PNG/WEBP)
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <img 
                    src={uploadedImage.thumbnail} 
                    alt="Uploaded preview"
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-800 truncate">
                      {uploadedImage.metadata.originalName}
                    </p>
                    <p className="text-xs text-green-600">
                      {uploadedImage.metadata.size} • Saved to assets/uploads/
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeUploadedImage}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Submit Issue Report
            </button>
          </div>
        </form>
      </div>
    
  );
}

export default ReportIssueForm;
