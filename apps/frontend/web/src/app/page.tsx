import Image from "next/image";
import LandingNavbar from "@/app/components/LandingNavbar";

export default function Home() {
  return (
    <>
      <div className="bg-white">
        <div className="container mx-auto px-4">
          <LandingNavbar />
          <section className="min-h-[80vh] flex flex-col lg:flex-row items-center justify-between py-16">
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
              <Image src="/img/burger.png" alt="Burger a hranolky" width={500} height={400} />
            </div>
          </section>
        </div>
      </div>

      <div className="custom-shape-divider-bottom mt-28">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>

      <section className="bg-[#EFEFEF] pb-16 pt-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold">Rychle a pohodlně? Jedině s feedy!</h2>
          <p className="mt-2 text-lg text-[var(--font)]">
            Rozlučte se s nekonečným čekáním na vaši objednávku!
          <br></br>
            Jídlo k vám dorazí čerstvé, včas a bez stresu.
          </p>
        </div>
        <div className="container mx-auto px-12">
          <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-white p-10 rounded-card shadow-md text-center max-w-sm mx-auto min-h-[200px] flex flex-col justify-between">
              <div className="bg-[var(--primary)] p-4 rounded-full inline-flex items-center justify-center w-16 h-16 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="32" height="32">
                  <path fill="#ffff" d="M253.3 35.1c6.1-11.8 1.5-26.3-10.2-32.4s-26.3-1.5-32.4 10.2L117.6 192 32 192c-17.7 0-32 14.3-32 32s14.3 32 32 32L83.9 463.5C91 492 116.6 512 146 512L430 512c29.4 0 55-20 62.1-48.5L544 256c17.7 0 32-14.3 32-32s-14.3-32-32-32l-85.6 0L365.3 12.9C359.2 1.2 344.7-3.4 332.9 2.7s-16.3 20.6-10.2 32.4L404.3 192l-232.6 0L253.3 35.1zM192 304l0 96c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-96c0-8.8 7.2-16 16-16s16 7.2 16 16zm96-16c8.8 0 16 7.2 16 16l0 96c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-96c0-8.8 7.2-16 16-16zm128 16l0 96c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-96c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--primary)] mt-5">Podporujeme místní podniky</h3>
              <p className="text-[var(--font)] mt-2">S každou objednávkou podpoříte podniky ve vašem okolí.</p>
            </div>

            <div className="bg-white p-10 rounded-card shadow-md text-center max-w-sm mx-auto min-h-[200px] flex flex-col justify-between">
              <div className="bg-[var(--primary)] p-4 rounded-full inline-flex items-center justify-center w-16 h-16 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="32" height="32">
                  <path fill="#ffffff" d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288l111.5 0L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7l-111.5 0L349.4 44.6z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--primary)] mt-5">Objednávka rychlostí blesku</h3>
              <p className="text-[var(--font)] mt-2">Zapomeňte na nekonečné čekání a objednejte si rychlostí blesku.</p>
            </div>

            <div className="bg-white p-10 rounded-card shadow-md text-center max-w-sm mx-auto min-h-[200px] flex flex-col justify-between">
              <div className="bg-[var(--primary)] p-4 rounded-full inline-flex items-center justify-center w-16 h-16 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="32" height="32">
                  <path fill="#ffffff" d="M190.5 68.8L225.3 128l-1.3 0-72 0c-22.1 0-40-17.9-40-40s17.9-40 40-40l2.2 0c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40L32 128c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l448 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-41.6 0c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88l-2.2 0c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0L152 0C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40l-72 0-1.3 0 34.8-59.2C329.1 55.9 342.9 48 357.8 48l2.2 0c22.1 0 40 17.9 40 40zM32 288l0 176c0 26.5 21.5 48 48 48l144 0 0-224L32 288zM288 512l144 0c26.5 0 48-21.5 48-48l0-176-192 0 0 224z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--primary)] mt-5">Získejte odměny za objednávky</h3>
              <p className="text-[var(--font)] mt-2">Čím více objednáte, tím více získáte odměn a slev na další objednávky.</p>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}