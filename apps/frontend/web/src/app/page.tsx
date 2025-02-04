import Image from "next/image";
import Navbar from "@/app/components/LandingNavbar";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Navbar />
      <section className="min-h-[80vh] flex flex-col lg:flex-row items-center lg:items-center justify-between py-16">
        <div className="max-w-3xl">
          <h1 className="text-6xl font-bold leading-snug bg-[var(--primary)] bg-clip-text text-transparent">
            Objevte nové restaurace ve vašem okolí!
          </h1>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Vložte doručovací adresu"
              className="bg-[var(--gray)] px-5 py-2 rounded-full w-full max-w-md"
            />
          </div>
        </div>

        <div className="mt-8 lg:mt-0">
          <Image src="/img/burger.png" alt="Burger a hranolky" width={400} height={300} />
        </div>
      </section>

      <section className="bg-[var(--gray)] py-16 rounded-t-[50px]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Rychle a pohodlně? Jedině s feedy!</h2>
          <p className="mt-2 text-[var(--font)]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse non dolor in neque cursus efficitur.
          </p>
        </div>
      </section>
    </div>
  );
}
