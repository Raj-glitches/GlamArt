import { Link } from 'react-router-dom';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-display font-bold text-primary-400 mb-4">GlamArt</h3>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for beauty, skincare, fashion, and accessories. 
              Discover the best brands and trends.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary-400">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-primary-400">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-primary-400">Twitter</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-gray-400 hover:text-white">All Products</Link></li>
              <li><Link to="/shop?category=makeup" className="text-gray-400 hover:text-white">Makeup</Link></li>
              <li><Link to="/shop?category=skincare" className="text-gray-400 hover:text-white">Skincare</Link></li>
              <li><Link to="/shop?category=haircare" className="text-gray-400 hover:text-white">Haircare</Link></li>
              <li><Link to="/stores" className="text-gray-400 hover:text-white">Store Locator</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQs</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white">Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-white">Returns & Exchanges</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400">
                <MapPinIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Connaught Place, New Delhi - 110001</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <PhoneIcon className="w-5 h-5 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <EnvelopeIcon className="w-5 h-5 flex-shrink-0" />
                <span>care@glamart.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} GlamArt. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-gray-400">
              <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
