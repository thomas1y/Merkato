

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        
        {/* MAIN FOOTER CONTENT - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* COLUMN 1: Brand Info */}
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-4">
              MERKATO
            </div>
            <p className="text-gray-400">
              Your one-stop shop for all your needs. 
              Quality products at affordable prices.
            </p>
          </div>

          {/* COLUMN 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a className="text-gray-400 hover:text-white">Home</a></li>
              <li><a className="text-gray-400 hover:text-white">All Products</a></li>
              <li><a className="text-gray-400 hover:text-white">Categories</a></li>
              <li><a className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* COLUMN 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@merkato.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Market St, City</li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR - Copyright & Social */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            
            {/* Copyright */}
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2024 Merkato. All rights reserved.
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a className="text-gray-400 hover:text-white">FB</a>
              <a className="text-gray-400 hover:text-white">TW</a>
              <a className="text-gray-400 hover:text-white">IG</a>
              <a className="text-gray-400 hover:text-white">IN</a>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}