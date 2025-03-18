import { BACKEND_URL } from '@/lib/constants';

export const fetchRestaurants = async (address: any, accessToken: any) => {

    try {
        const response = await fetch(`${BACKEND_URL}/restaurant`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) throw new Error("Restaurants fetch failed");

        const data = await response.json();

        const formattedData = data.filter((restaurant: any) => 
            restaurant.status == "Approved" &&
            restaurant.address?.city == address.city
        );

        console.log(formattedData)

        return formattedData
            .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
            .slice(0, 10)
            .map((restaurant: any) => ({
                ...restaurant,
                rating: (Math.random() * 2 + 3).toFixed(1),
                deliveryTime: `${Math.floor(Math.random() * 20) + 20} min`
            }));
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        return [];
    }
};