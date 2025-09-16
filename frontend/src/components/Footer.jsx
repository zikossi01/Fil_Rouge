import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Additional useful information */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Store Hours</h4>
              <p>Monday - Friday: 8:00 AM - 10:00 PM</p>
              <p>Saturday - Sunday: 9:00 AM - 9:00 PM</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Contact Info</h4>
              <p>📞 (555) 123-4567</p>
              <p>📧 support@groceryhub.com</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Delivery Info</h4>
              <p>Free delivery on orders over $50</p>
              <p>Same-day delivery available</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}