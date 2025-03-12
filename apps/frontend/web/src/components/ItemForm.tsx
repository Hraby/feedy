'use client';

import { useState } from 'react';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    available: boolean;
}

interface ItemFormProps {
    item: MenuItem | null;
    onSave: (item: MenuItem) => void;
    onDelete: (id: number) => void;
}

const ItemForm = ({ item, onSave, onDelete }: ItemFormProps) => {
    const [name, setName] = useState(item?.name || '');
    const [description, setDescription] = useState(item?.description || '');
    const [price, setPrice] = useState(item?.price || 0);
    const [category, setCategory] = useState(item?.category || '');
    const [image, setImage] = useState<File | null>(null);
    const [available, setAvailable] = useState(item?.available ?? true);
    const [confirmDelete, setConfirmDelete] = useState(false);

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
            image: imageUrl,
            available
        });
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            className="max-w-lg mx-auto bg-white py-6 rounded-2xl space-y-4 my-4 max-h-[90vh] overflow-y-auto"
        >
            <h2 className="text-3xl font-bold text-center text-gray-800">{item ? 'Upravit položku' : 'Přidat položku'}</h2>

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
                        className="input-field"
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

                <label className="block">
                    <span className="text-gray-700">Obrázek</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="input-field"
                    />
                </label>

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
                    className="w-full py-3 rounded-xl font-semibold bg-[var(--gradient-purple-start)] hover:bg-[var(--gradient-purple-end)] text-white transition mb-2"
                >
                    {item ? 'Uložit změny' : 'Přidat položku'}
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