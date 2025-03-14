"use client";

import { useState, useEffect } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { setDeliveryAddress } from "@/app/actions/deliveryAddressAction";
import { useAuth } from "@/contexts/AuthProvider";

const ALLOWED_CITIES = ["Brno", "Praha", "Zlín"];

export default function AutoComplete({ onClose }: any) {
  const { address } = useAuth();
  const [items, setItems] = useState<{ id: string; name: string; data?: any }[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (address && !query) {
      setItems([
        {
          id: "address",
          name: `${address.street}, ${address.zipCode}, ${address.city}, ${address.country}`,
        },
      ]);
    }
  }, [address, query]);

  const fetchData = async (query: string) => {
    if (!query) return;

    try {
      const response = await fetch(
        `https://api.mapy.cz/v1/suggest?lang=cs&limit=5&type=regional.address&apikey=${encodeURI(
          process.env.MAPY_API_KEY as string
        )}&query=${encodeURI(query)}`
      );

      const data = await response.json();

      const suggestions = data.items
        .filter((item: any) => {
          const municipality = item.regionalStructure?.find((region: any) => region.type === "regional.municipality")?.name;
          return municipality && ALLOWED_CITIES.includes(municipality);
        })
        .map((item: any, index: number) => { 
          const municipality = item.regionalStructure?.find((region: any) => region.type === "regional.municipality")?.name || "";
          const zipCode = item.zip || "";
          const street = item.name || "";

          return {
            id: item.id ? `${item.id}-${index}` : `item-${index}`,
            name: `${street}, ${zipCode}, ${municipality}`,
            data: item,
          };
        });

      setItems(suggestions);
    } catch (error) {
      console.error("Chyba při načítání adres:", error);
      setItems([]);
    }
  };

  const handleSelect = async (item: { id: string; name: string; data?: any }) => {
    if (!item.data) {
      console.error("Neplatná data pro adresu:", item);
      return;
    }

    const selectedItem = item.data;
    const street = selectedItem.name || "";
    const zipCode = selectedItem.zip || "";
    const municipality = selectedItem.regionalStructure?.find(
      (region: any) => region.type === "regional.municipality"
    )?.name || "";

    if (!municipality) {
      console.error("Nepodařilo se získat město:", selectedItem);
      return;
    }

    const addressData = {
      street,
      zipCode,
      city: municipality,
      country: "Czechia",
    };

    try {
      await setDeliveryAddress(addressData);
      onClose();
    } catch (error) {
      console.error("Chyba při ukládání adresy", error);
    }
  };

  return (
    <div className="relative w-full">
      <ReactSearchAutocomplete
        items={items}
        onSearch={(value) => {
          setQuery(value);
          fetchData(value);
        }}
        onClear={() => setItems([])}
        onSelect={handleSelect}
        placeholder="Zadejte adresu..."
        styling={{
          borderRadius: "12px",
          backgroundColor: "#F8F8F8",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          fontSize: "16px",
        }}
        autoFocus
        showNoResultsText="Nenalezeno"
      />
    </div>
  );
}