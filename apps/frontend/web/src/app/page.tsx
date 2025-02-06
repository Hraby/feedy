import Image from "next/image";
import LandingNavbar from "@/app/components/LandingNavbar";
import AppWidget from "./components/LandingWidget";

export default function Home() {
  return (
    <>
      <div className="bg-white">
        <div className="container mx-auto px-4">
          <LandingNavbar />
          <section className="min-h-[70vh] flex flex-col lg:flex-row items-center justify-between py-12 lg:py-16 text-center lg:text-left">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-snug bg-[var(--primary)] bg-clip-text text-transparent">
                Objevte nové restaurace ve vašem okolí!
              </h1>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Vložte doručovací adresu"
                  className="bg-[var(--gray)] px-5 py-2 rounded-full w-full max-w-md text-center lg:text-left"
                />
              </div>
            </div>

            <div className="mt-8 lg:mt-0">
              <Image src="/img/burger.png" alt="Burger a hranolky" width={400} height={300} className="mx-auto" />
            </div>
          </section>
        </div>
      </div>

      <div className="custom-shape-divider-bottom mt-16 lg:mt-28">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>

      <section className="bg-[#EFEFEF] pb-12 lg:pb-16 pt-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold">Rychle a pohodlně? Jedině s feedy!</h2>
          <p className="mt-2 text-base lg:text-lg text-[var(--font)]">
            Rozlučte se s nekonečným čekáním na vaši objednávku!
            <br />
            Jídlo k vám dorazí čerstvé, včas a bez stresu.
          </p>
        </div>

        <div className="container mx-auto px-6 md:px-12">
          <div className="mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Podporujeme místní podniky", text: "S každou objednávkou podpoříte podniky ve vašem okolí." },
              { title: "Objednávka rychlostí blesku", text: "Zapomeňte na nekonečné čekání a objednejte si rychlostí blesku." },
              { title: "Získejte odměny za objednávky", text: "Čím více objednáte, tím více získáte odměn a slev na další objednávky." },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 lg:p-10 lg:py-12 rounded-card shadow-md text-center max-w-sm mx-auto min-h-[200px] flex flex-col justify-between"
              >
                <div className="bg-[var(--primary)] p-4 rounded-full inline-flex items-center justify-center w-16 h-16 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="32" height="32">
                    <path fill="#ffffff" d="M253.3 35.1c6.1-11.8 1.5-26.3-10.2-32.4s-26.3-1.5-32.4 10.2L117.6 192 32 192c-17.7 0-32 14.3-32 32s14.3 32 32 32L83.9 463.5C91 492 116.6 512 146 512L430 512c29.4 0 55-20 62.1-48.5L544 256c17.7 0 32-14.3 32-32s-14.3-32-32-32l-85.6 0L365.3 12.9C359.2 1.2 344.7-3.4 332.9 2.7s-16.3 20.6-10.2 32.4L404.3 192l-232.6 0L253.3 35.1z" />
                  </svg>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-[var(--primary)] mt-5">{item.title}</h3>
                <p className="text-[var(--font)] mt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#EFEFEF] pb-12 lg:pb-16 pt-10">
        <AppWidget />
      </section>
    </>
  );
}
