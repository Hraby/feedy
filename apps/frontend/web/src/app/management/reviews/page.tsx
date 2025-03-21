'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import ManagementSidebar from '@/components/ManagementSidebar';
import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';

interface Review {
    id: number;
    user: string;
    rating: number;
    comment: string;
}

const reviews: Review[] = [
    { id: 1, user: "Jan Novák", rating: 5, comment: "Skvělé jídlo a rychlé doručení!" },
    { id: 2, user: "Petr Svoboda", rating: 4, comment: "Jídlo bylo vynikající, ale doručení trvalo déle." },
    { id: 3, user: "Eva Dvořáková", rating: 3, comment: "Průměrná kvalita, ale cena byla dobrá." },
];

const Reviews = () => {
    const pathname = usePathname();
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <div className="w-64 fixed top-0 left-0 h-screen">
                <ManagementSidebar activePath={pathname} />
            </div>

            <main className="flex-1 p-8 ml-64 min-h-screen">
                <h2 className="text-4xl font-bold mb-2">Recenze</h2>
                <p className="text-gray-600 mb-8">Zobrazte recenze od zákazníků.</p>

                <div className="bg-white p-6 rounded-3xl shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-white">
                            <tr className="border-b">
                                <th className="p-4">Jméno</th>
                                <th className="p-4">Hodnocení</th>
                                <th className="p-4 text-right">Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr key={review.id} className="border-b hover:bg-gray-100">
                                    <td className="p-4">{review.user}</td>
                                    <td className="p-4">{review.rating} ⭐</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => setSelectedReview(review)}
                                            className="bg-gradient-to-r from-[var(--gradient-purple-start)] to-[var(--gradient-purple-end)] text-white px-4 py-2 rounded-full"
                                        >
                                            Zobrazit recenzi
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            {selectedReview && (
                <Modal isOpen={!!selectedReview} onClose={() => setSelectedReview(null)}>
                    <h2 className="text-2xl font-bold mb-4">Recenze od {selectedReview.user}</h2>
                    <p className="text-lg mb-2">Hodnocení: {selectedReview.rating} ⭐</p>
                    <p className="text-lg mb-2 text-[var(--gradient-purple-end)]">{selectedReview.comment}</p>
                </Modal>
            )}
            <ToastContainer />
        </div>
    );
};

export default Reviews;
