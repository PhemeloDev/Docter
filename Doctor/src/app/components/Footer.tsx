import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">HealthHive</h3>
            <p className="text-gray-400 mb-4">
              Providing high-quality medical consultations online, anytime.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-all duration-200 hover-scale focus-ring rounded-lg p-2" 
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-all duration-200 hover-scale focus-ring rounded-lg p-2" 
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-all duration-200 hover-scale focus-ring rounded-lg p-2" 
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-all duration-200 hover-scale focus-ring rounded-lg p-2" 
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 focus-ring rounded px-2 py-1">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 focus-ring rounded px-2 py-1">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 focus-ring rounded px-2 py-1">
                  Book a Doctor
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 focus-ring rounded px-2 py-1">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 focus-ring rounded px-2 py-1">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 focus-ring rounded px-2 py-1">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 focus-ring rounded px-2 py-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 focus-ring rounded px-2 py-1">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/hipaa" className="text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 focus-ring rounded px-2 py-1">
                  HIPAA Compliance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <address className="text-gray-400 not-italic space-y-3">
              <p>1234 HealthHive Plaza</p>
              <p>New York, NY 10001</p>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="w-4 h-4" />
                <span>support@healthhive.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhone className="w-4 h-4" />
                <span>(555) 123-HIVE</span>
              </div>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-gray-400 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} HealthHive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 