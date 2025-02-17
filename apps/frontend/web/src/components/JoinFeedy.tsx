"use client";
import { useState } from "react";
import Image from "next/image";
import Modal from "@/components/Modal";
import CourierForm from "@/components/CourierForm";
import RestaurantForm from "@/components/RestaurantForm";

const JoinFeedy = () => {
  const [openModal, setOpenModal] = useState<"courier" | "restaurant" | null>(null);

  return (
    <section className="bg-[#EFEFEF] pb-12 lg:pb-16 pt-28">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold">Chcete se stát součástí feedy?</h2>
        <p className="mt-2 text-base lg:text-lg text-[var(--font)]">
          Ať už hledáte flexibilní brigádu nebo chcete rozšířit dosah své restaurace, u nás jste správně!
        </p>
      </div>
      <div className="container mx-auto px-6 md:px-16 mt-9 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="relative rounded-card overflow-hidden cursor-pointer group h-[250px] md:h-[300px]"
          onClick={() => setOpenModal("courier")}
        >
          <Image
            src="/img/courier.jpg"
            alt="Staňte se feedy kurýrem"
            width={600}
            height={300}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <span className="text-white text-2xl md:text-3xl font-bold ml-6 mb-6 w-3/4">
              Staňte se partnerským feedy kurýrem
            </span>
          </div>
        </div>
        <div
          className="relative rounded-card overflow-hidden cursor-pointer group h-[250px] md:h-[300px]"
          onClick={() => setOpenModal("restaurant")}
        >
          <Image
            src="/img/restaurant.jpg"
            alt="Přidejte vlastní restauraci nebo obchod"
            width={600}
            height={300}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <span className="text-white text-2xl md:text-3xl font-bold ml-6 mb-6 w-3/4">
              Přidejte vlastní restauraci nebo obchod
            </span>
          </div>
        </div>
      </div>
      <Modal isOpen={openModal === "courier"} onClose={() => setOpenModal(null)}>
        <CourierForm />
      </Modal>
      <Modal isOpen={openModal === "restaurant"} onClose={() => setOpenModal(null)}>
        <RestaurantForm />
      </Modal>
    </section>
  );
};

export default JoinFeedy;
