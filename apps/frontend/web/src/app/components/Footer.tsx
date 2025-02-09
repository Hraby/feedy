import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#EBEBEB] h-60 flex items-center">
      <div className="container mx-auto px-16 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="text-2xl font-bold text-[var(--primary)]">feedy.</div>

        <nav className="flex space-x-6 mt-4 md:mt-0">
          <Link href="#">
            <span className="text-[var(--font)] hover:text-[var(--primary)] transition-colors duration-300">
              O nás
            </span>
          </Link>
          <Link href="#">
            <span className="text-[var(--primary)] font-semibold transition-all duration-300">
              Podmínky služby
            </span>
          </Link>
          <Link href="#">
            <span className="text-[var(--font)] hover:text-[var(--primary)] transition-colors duration-300">
              Kontakt
            </span>
          </Link>
        </nav>
        
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="#">
            <FaFacebookF className="text-[var(--primary)] text-xl hover:scale-110 transition-transform duration-300" />
          </Link>
          <Link href="#">
            <FaInstagram className="text-[var(--primary)] text-xl hover:scale-110 transition-transform duration-300" />
          </Link>
          <Link href="#">
            <FaTwitter className="text-[var(--primary)] text-xl hover:scale-110 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
