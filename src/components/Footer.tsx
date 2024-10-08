import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-10">
      <MaxWidthWrapper>
        {/* Top section with links */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-300 pb-6">
          <div className="flex space-x-8">
            <Link
              href="#"
              className="text-gray-600 text-sm hover:text-gray-900 transition"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-gray-600 text-sm hover:text-gray-900 transition"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-gray-600 text-sm hover:text-gray-900 transition"
            >
              Cookie Policy
            </Link>
          </div>

          {/* Social media icons with brand colors */}
          <div className="flex space-x-4 mt-6 md:mt-0">
            <Link href="#" className="social-icon facebook">
              <i className="fab fa-facebook-f"></i>
            </Link>
            <Link href="#" className="social-icon twitter">
              <i className="fab fa-twitter"></i>
            </Link>
            <Link href="#" className="social-icon instagram">
              <i className="fab fa-instagram"></i>
            </Link>
            <Link href="#" className="social-icon linkedin">
              <i className="fab fa-linkedin-in"></i>
            </Link>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
          </p>
          <p className="mt-4 md:mt-0">
            Designed with <span className="text-red-500">♥</span> by Mahmoud Yousef
          </p>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
