import React, { useState, useEffect } from 'react';
import { Truck, User, Phone, MapPin, Package, Clock } from 'lucide-react';
import Loading from '../components/common/Loading.jsx';

const DeliveryPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    setTimeout(() => {
      setDeliveries([
        {
          _id: 'delivery-1',
          status: 'assigned',
          order: {
            _id: 'order-1',
            totalAmount: 25.97,
            user: { name: 'Alice Johnson', phone: '+1234567890' },
            deliveryAddress: { street: '123 Main St', city: 'Springfield', postalCode: '12345' }
          },
          createdAt: '2025-08-18T09:00:00Z'
        },
        {
          _id: 'delivery-2',
          status: 'picked_up',
          order: {
            _id: 'order-2',
            totalAmount: 45.50,
            user: { name: 'Bob Smith', phone: '+1234567891' },
            deliveryAddress: { street: '456 Oak Ave', city: 'Springfield', postalCode: '12346' }
          },
          createdAt: '2025-08-18T08:30:00Z'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    setDeliveries(prev => prev.map(delivery =>
      delivery._id === deliveryId ? { ...delivery, status: newStatus } : delivery
    ));
  };

  const getStatusColor = (status) => {
    const colors = {
      assigned: 'bg-blue-100 text-blue-800',
      picked_up: 'bg-orange-100 text-orange-800',
      on_way: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Deliveries</h1>
      
      {deliveries.length === 0 ? (
        <div className="text-center py-12">
          <Truck className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No deliveries assigned</h2>
          <p className="text-gray-600">Check back later for new delivery assignments!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {deliveries.map(delivery => (
            <div key={delivery._id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delivery #{delivery._id}</h3>
                  <p className="text-gray-600">Order #{delivery.order._id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                  {delivery.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-medium">{delivery.order.user.name}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{delivery.order.user.phone}</span>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <MapPin className="h-4 w-4 mr-2 mt-1" />
                    <div>
                      <p>{delivery.order.deliveryAddress.street}</p>
                      <p>{delivery.order.deliveryAddress.city}, {delivery.order.deliveryAddress.postalCode}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <Package className="h-4 w-4 mr-2" />
                    <span className="font-medium">Order Value: ${delivery.order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Ordered: {new Date(delivery.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {delivery.status === 'assigned' && (
                  <button
                    onClick={() => updateDeliveryStatus(delivery._id, 'picked_up')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Mark as Picked Up
                  </button>
                )}
                {delivery.status === 'picked_up' && (
                  <button
                    onClick={() => updateDeliveryStatus(delivery._id, 'on_way')}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Mark as On the Way
                  </button>
                )}
                {delivery.status === 'on_way' && (
                  <button
                    onClick={() => updateDeliveryStatus(delivery._id, 'delivered')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryPage;