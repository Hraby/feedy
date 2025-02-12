import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#EBEBEB] py-8">
      <div className="container mx-auto px-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-6 md:space-y-0">
        <div className="text-2xl font-bold text-[var(--primary)]">feedy.</div>

        <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          <Link href="#">
            <span className="text-[var(--font)] hover:text-[var(--primary)] transition-colors duration-300">
              O nás
            </span>
          </Link>
          <Link href="#">
            <span className="text-[var(--font)] hover:text-[var(--primary)] transition-colors duration-300">
              Podmínky služby
            </span>
          </Link>
          <Link href="#">
            <span className="text-[var(--font)] hover:text-[var(--primary)] transition-colors duration-300">
              Kontakt
            </span>
          </Link>
        </nav>

        {/* Sociální sítě */}
        <div className="flex space-x-6 mt-4">
          <Link href="#">
            <FaFacebookF className="text-[var(--primary)] text-2xl hover:scale-110 transition-transform duration-300" />
          </Link>
          <Link href="#">
            <FaInstagram className="text-[var(--primary)] text-2xl hover:scale-110 transition-transform duration-300" />
          </Link>
          <Link href="#">
            <FaXTwitter className="text-[var(--primary)] text-2xl hover:scale-110 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
