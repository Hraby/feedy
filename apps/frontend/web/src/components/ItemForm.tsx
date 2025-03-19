"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
}

interface ItemFormProps {
  item: MenuItem | null;
  onSave: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

const ItemForm = ({ item, onSave, onDelete }: ItemFormProps) => {
  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [price, setPrice] = useState(item?.price || 0);
  const [category, setCategory] = useState(item?.category || '');
  const [image, setImage] = useState<File | null>(null);
  const [available, setAvailable] = useState(item?.available ?? true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(item?.imageUrl || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
      
      return () => URL.revokeObjectURL(objUrl);
    }
  };

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      setUploadError(null);
      
      const supabase = createClient();
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('menu-item-images')
        .upload(filePath, file);
        
      if (error) {
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('menu-item-images')
        .getPublicUrl(filePath);
        
      return publicUrl;
    } catch (error) {
      console.error('Chyba při nahrávání:', error);
      setUploadError(error instanceof Error ? error.message : 'Nastala neznámá chyba při nahrávání');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = item?.imageUrl || '';
      
      if (image) {
        imageUrl = await uploadImageToSupabase(image);
      }

      onSave({
        id: item?.id || "",
        name,
        description,
        price,
        category,
        imageUrl: imageUrl,
        available
      });
    } catch (error) {
      console.error('Chyba při ukládání položky:', error);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="max-w-lg mx-auto bg-white py-6 rounded-2xl space-y-4 my-4 max-h-[90vh] overflow-y-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800">
        {item ? 'Upravit položku' : 'Přidat položku'}
      </h2>
      
      <div className="space-y-4 px-4">
        <label className="block">
          <span className="text-gray-700">Název</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            required
          />
        </label>
        
        <label className="block">
          <span className="text-gray-700">Popis</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field h-32"
            style={{ resize: "none" }}
            required
          />
        </label>
        
        <label className="block">
          <span className="text-gray-700">Cena</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="input-field"
            required
          />
        </label>
        
        <label className="block">
          <span className="text-gray-700">Kategorie</span>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
            required
          />
        </label>
        
        <div className="block">
          <span className="text-gray-700">Obrázek</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="input-field"
          />
          
          {previewUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Náhled:</p>
              <img 
                src={previewUrl} 
                alt="Náhled" 
                className="w-full max-h-48 object-contain rounded-lg border border-gray-300" 
              />
            </div>
          )}
          
          {uploading && <p className="text-sm text-blue-500 mt-1">Nahrávání...</p>}
          {uploadError && <p className="text-sm text-red-500 mt-1">{uploadError}</p>}
        </div>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={available}
            onChange={() => setAvailable(!available)}
            className="form-checkbox"
          />
          <span className="text-gray-700">Dostupné pro objednání</span>
        </label>
      </div>
      
      <div className="items-center px-4">
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-3 rounded-xl font-semibold ${
            uploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[var(--gradient-purple-start)] hover:bg-[var(--gradient-purple-end)]'
          } text-white transition mb-2`}
        >
          {uploading ? 'Nahrávání...' : item ? 'Uložit změny' : 'Přidat položku'}
        </button>
        
        {item && (
          confirmDelete ? (
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="w-full py-3 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white transition"
            >
              Opravdu smazat?
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="w-full py-3 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white transition"
            >
              Smazat položku
            </button>
          )
        )}
      </div>
      
      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 16px;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .input-field:focus {
          border-color: #9ca3af;
          background-color: #f3f4f6;
          outline: none;
        }
        .form-checkbox {
          width: 20px;
          height: 20px;
        }
      `}</style>
    </form>
  );
};

export default ItemForm;