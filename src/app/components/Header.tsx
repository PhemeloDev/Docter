import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MediConsult
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link href="/services" className="text-gray-700 hover:text-blue-600">
            Services
          </Link>
          <Link href="/book" className="text-gray-700 hover:text-blue-600">
            Book a Doctor
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600">
            About Us
          </Link>
          <Link href="/faqs" className="text-gray-700 hover:text-blue-600">
            FAQs
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600">
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link 
            href="/login" 
            className="px-4 py-2 text-gray-700 hover:text-blue-600"
          >
            Login
          </Link>
          <Link 
            href="/signup" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 