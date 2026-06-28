import React, { useState, useEffect, useMemo, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import AdminPageHeader from '../../components/admin/ui/AdminPageHeader';
import { Trash2, UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';

const CATEGORIES = ['Campus', 'Training', 'Events', 'Hostel', 'Achievements'];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Upload State
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setImages(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredImages = useMemo(() => {
    return images.filter(img => {
      return categoryFilter === 'All' ? true : img.category === categoryFilter;
    });
  }, [images, categoryFilter]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);
    setUploadProgress(0);

    let completedCount = 0;

    for (const file of files) {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `gallery/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      try {
        // Upload to Storage
        const uploadTask = await uploadBytesResumable(storageRef, file);
        const downloadURL = await getDownloadURL(uploadTask.ref);

        // Add to Firestore
        await addDoc(collection(db, 'gallery'), {
          url: downloadURL,
          storagePath: fileName,
          category: selectedCategory,
          filename: file.name,
          createdAt: serverTimestamp()
        });

        completedCount++;
        setUploadProgress(Math.round((completedCount / files.length) * 100));
      } catch (err) {
        console.error("Upload failed for file:", file.name, err);
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    alert(`Successfully uploaded ${completedCount} of ${files.length} images.`);
  };

  const handleDelete = async (image) => {
    if (window.confirm("Delete this image permanently?")) {
      try {
        // Delete from Storage if path exists
        if (image.storagePath) {
          const storageRef = ref(storage, image.storagePath);
          await deleteObject(storageRef);
        }
        // Delete from Firestore
        await deleteDoc(doc(db, 'gallery', image.id));
      } catch (err) {
        console.error("Delete failed", err);
        alert("Failed to delete image.");
      }
    }
  };

  return (
    <>
      <AdminPageHeader 
        title="Gallery Management" 
        subtitle="Upload and manage academy photos by category."
        filterOptions={[
          { label: "All Categories", value: "All" },
          ...CATEGORIES.map(c => ({ label: c, value: c }))
        ]}
        activeFilter={categoryFilter}
        onFilterChange={setCategoryFilter}
      />

      {/* Upload Zone */}
      <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm mb-6">
        <h4 className="font-bebas text-xl tracking-wider text-military-green mb-4">Upload New Images</h4>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Select Category</label>
            <select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none bg-white"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div className="w-full md:w-2/3 flex gap-4">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden" 
              id="gallery-upload"
              disabled={isUploading}
            />
            <label 
              htmlFor="gallery-upload" 
              className={`flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-sm py-4 cursor-pointer hover:border-military-green hover:bg-military-green/5 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <UploadCloud className="w-5 h-5 text-gray-500" />
              <span className="font-inter text-sm text-gray-600 font-medium">Choose images or drag & drop</span>
            </label>
          </div>
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="flex justify-between text-xs font-oswald uppercase tracking-wider text-gray-500 mb-1">
              <span>Uploading Images...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-military-green h-1.5 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-military-green animate-spin" />
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm py-20 text-center flex flex-col items-center shadow-sm">
          <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
          <h3 className="font-bebas text-2xl text-gray-400 tracking-wider mb-1">No Images Found</h3>
          <p className="text-gray-500 font-inter text-sm">Upload some images to populate the gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredImages.map((img) => (
            <div key={img.id} className="group bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
              <div className="aspect-square bg-gray-100 relative">
                <img 
                  src={img.url} 
                  alt={img.filename || 'Gallery Image'} 
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <button 
                    onClick={() => handleDelete(img)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 hover:scale-110 transition-all shadow-lg"
                    title="Delete Image"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-2 border-t border-gray-100">
                <span className="block text-[10px] font-oswald uppercase tracking-wider text-gray-500 mb-0.5">{img.category}</span>
                <span className="block text-xs font-inter text-gray-900 truncate" title={img.filename}>{img.filename || 'Uploaded Image'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Gallery;
