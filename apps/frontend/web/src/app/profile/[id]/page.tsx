'use client';
import NavbarSwitcher from "@/components/NavbarSwitch";
import { useAuth } from "@/contexts/AuthProvider";
import { useParams } from "next/navigation";

const Profile = () => {
    const {user} = useAuth();
    const { id } = useParams();

    if (!user || user.id !== id) return <p>Uživatel nenalezen</p>;

    return (
        <div>
            <NavbarSwitcher />

            <div className="min-h-screen flex flex-col items-center py-10">
                <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl p-8 space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-600">
                            {user.name[0]}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                        <div className="space-y-4">
                            {user.role.map((role) => (
                                <span key={role} className={`px-3 py-1 rounded-xl text-white mr-1 ${role === 'Admin' ? 'bg-red-500' : role === 'Courier' ? 'bg-green-500' : role === 'Restaurant' ? 'bg-purple-500' : 'bg-gray-500'}`}>
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
