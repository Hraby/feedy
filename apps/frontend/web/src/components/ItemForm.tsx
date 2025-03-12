'use client';

import { useState } from 'react';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
}

interface ItemFormProps {
    item: MenuItem | null;
    onSave: (item: MenuItem) => void;
}

const ItemForm = ({ item, onSave }: ItemFormProps) => {
    const [name, setName] = useState(item?.name || '');
    const [description, setDescription] = useState(item?.description || '');
    const [price, setPrice] = useState(item?.price || 0);
    const [category, setCategory] = useState(item?.category || '');
    const [image, setImage] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        const imageUrl = image ? URL.createObjectURL(image) : item?.image || '/img/default.png';
        onSave({
            id: item?.id || 0,
            name,
            description,
            price,
            category,
            image: imageUrl
        });
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            className="max-w-lg mx-auto bg-white py-6 rounded-2xl space-y-4 my-4 max-h-[80vh] overflow-y-auto"
        >
            <h2 className="text-3xl font-bold text-center text-gray-800">{item ? 'Upravit položku' : 'Přidat položku'}</h2>

            <div className="space-y-4 px-4">
                <input
                    type="text"
                    placeholder="Název"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    required
                />

                <textarea
                    placeholder="Popis"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field"
                    required
                />

                <input
                    type="number"
                    placeholder="Cena"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="input-field"
                    required
                />

                <input
                    type="text"
                    placeholder="Kategorie"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-field"
                    required
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="input-field"
                />
            </div>

            <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold bg-[var(--gradient-purple-start)] hover:bg-[var(--gradient-purple-end)] text-white transition"
            >
                {item ? 'Uložit změny' : 'Přidat položku'}
            </button>

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
            `}</style>
        </form>
    );
};

export default ItemForm;