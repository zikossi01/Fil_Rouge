import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute top-20 right-0 w-72 h-72 bg-gray-200 rounded-full blur-3xl opacity-30 animate-pulse-slow"/>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gray-300 rounded-full blur-3xl opacity-30 animate-ping-slow"/>
        
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Groceries, Delivered with <span className="text-gray-800 border-b-4 border-gray-800">Care</span>
              </h1>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                Shop thousands of products from fresh food to electronics and essentials.
                Fast delivery, transparent pricing, and a delightful experience from start to finish.
              </p>
              <div className="mt-8 flex gap-4">
                <Link 
                  to="/products" 
                  className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Browse Products
                </Link>
                <a 
                  href="#how-it-works" 
                  className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  How it works
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"></span>
                  Same-day delivery
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"></span>
                  Trusted couriers
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"></span>
                  Secure checkout
                </div>
              </div>
            </div>
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-xl group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=800&auto=format&fit=crop" 
                    alt="Groceries" 
                    className="rounded-xl object-cover h-56 w-full transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="relative overflow-hidden rounded-xl group mt-8">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop" 
                    alt="Headphones" 
                    className="rounded-xl object-cover h-56 w-full transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="relative overflow-hidden rounded-xl group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop" 
                    alt="Fashion" 
                    className="rounded-xl object-cover h-56 w-full transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="relative overflow-hidden rounded-xl group mt-8">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop" 
                    alt="Home" 
                    className="rounded-xl object-cover h-56 w-full transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">A better way to shop</h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Simple steps that save you time and bring the store to your door.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { number: 1, title: "Discover", description: "Explore curated categories and powerful search to find exactly what you need.", color: "gray" },
              { number: 2, title: "Add to cart", description: "Flexible quantities, clear pricing, and a clean cart experience.", color: "gray" },
              { number: 3, title: "Delivered", description: "Our couriers deliver on-time with live updates and hassle-free drop-off.", color: "gray" }
            ].map((step, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xl font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>
                <h3 className="mt-4 font-semibold text-lg text-gray-900">{step.title}</h3>
                <p className="mt-2 text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Thoughtful design", description: "Subtle colors, refined typography, and a layout that just feels right.", icon: "✨" },
              { title: "Smart search", description: "Find across categories instantly—TVs, t‑shirts, controllers, you name it.", icon: "🔍" },
              { title: "Secure and fast", description: "Protected routes, role-based dashboards, and quick, reliable delivery.", icon: "⚡" }
            ].map((item, index) => (
              <div 
                key={index} 
                className="rounded-xl border border-gray-200 p-6 bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 group"
              >
                <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900">Loved by customers</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { quote: "Fast, friendly, reliable.", name: "Sarah M.", rating: "5★" },
              { quote: "Beautiful app—buying is a joy.", name: "James L.", rating: "5★" },
              { quote: "Best delivery experience I've had.", name: "Olivia T.", rating: "5★" }
            ].map((testimonial, i) => (
              <div 
                key={i} 
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 group"
              >
                <div className="text-gray-800 text-2xl mb-2">★★★★★</div>
                <p className="text-gray-700">"{testimonial.quote}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.rating} experience</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 text-center rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white">
            Ready to discover something great?
          </h2>
          <p className="mt-3 text-gray-300 max-w-2xl mx-auto">
            Start browsing our catalog and build your cart in seconds. Minimal steps, maximum delight.
          </p>
          <Link 
            to="/products" 
            className="inline-block mt-8 px-8 py-3 rounded-lg bg-white text-gray-900 font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Explore Products
          </Link>
        </div>
      </section>
    </div>
  );
}