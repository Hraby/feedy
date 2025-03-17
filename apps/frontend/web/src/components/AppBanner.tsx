import Image from "next/image";

export default function AppBanner() {
  return (
    <div className="container mx-auto px-6 md:px-16 lg:px-16 mt-10 relative">
      <div
        className="relative rounded-3xl p-14 flex flex-col md:flex-row items-center justify-between text-white overflow-visible"
        style={{
          background: "linear-gradient(to bottom, var(--gradient-start), var(--gradient-end))",
        }}
      >
        <div className="max-w-lg relative z-10 text-center md:text-left w-full md:w-auto">
          <h2 className="text-2xl md:text-3xl font-bold whitespace-nowrap">Vyzkoušeli jste už naši mobilní aplikaci?</h2>
          <p className="mt-3 text-base md:text-lg">
            Objednávejte jídlo rychle a pohodlně přímo z mobilu. Stáhněte si naši aplikaci a užijte si skvělé výhody.
          </p>
          <button
            className="bg-white text-[var(--primary)] mt-3 transition-transform duration-300 hover:scale-105 px-7 py-2 rounded-full text-lg font-semibold whitespace-nowrap"
          >
            Stáhnout aplikaci
          </button>
        </div>
        <div className="absolute right-20">
          <div className="relative xl:block hidden">
            <Image
              src="/img/landing-widget-mobile.png"
              alt="Mobilní aplikace"
              width={225}
              height={575}
              className="z-20 -top-24 md:-top-32 md:right-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}