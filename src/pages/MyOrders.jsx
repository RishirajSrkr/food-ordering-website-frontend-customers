import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Leaf, 
  ShoppingBag, 
  Clock, 
  Truck, 
  CheckCircle, 
  X, 
  RefreshCw, 
  DollarSign, 
  MapPin, 
  Mail, 
  Phone, 
  ArrowRight,
  FileText,
  RotateCcw
} from 'lucide-react';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setOrders(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Define status color and icon based on order status
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Preparing':
        return { 
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <Clock className="h-4 w-4 mr-1.5" />,
          message: 'We\'re preparing your fresh food!'
        };
      case 'Shipped':
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: <Truck className="h-4 w-4 mr-1.5" />,
          message: 'Your food is on the way!'
        };
      case 'Delivered':
        return { 
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: <CheckCircle className="h-4 w-4 mr-1.5" />,
          message: 'Enjoy your meal!'
        };
      case 'Cancelled':
        return { 
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: <X className="h-4 w-4 mr-1.5" />,
          message: 'Order cancelled'
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: <FileText className="h-4 w-4 mr-1.5" />,
          message: 'Order received'
        };
    }
  };

  // Define payment status info
  const getPaymentStatusInfo = (status) => {
    return status === 'Paid' 
      ? { color: 'text-green-600', icon: <DollarSign className="h-4 w-4 mr-1.5" /> }
      : { color: 'text-amber-600', icon: <Clock className="h-4 w-4 mr-1.5" /> };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="rounded-full bg-green-100 p-3 mb-4">
          <Leaf className="h-10 w-10 text-green-500 animate-pulse" />
        </div>
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-green-500 mb-4"></div>
        <p className="mt-2 text-gray-700 font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 max-w-md w-full">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 rounded-full p-3 mr-4">
              <X className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Something went wrong</h2>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-lime-600 transition shadow-sm flex items-center justify-center"
          >
            <RefreshCw size={18} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-green-100 max-w-md w-full">
          <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Your order history is empty</h2>
          <p className="text-gray-600 mb-8">You haven't placed any food orders yet. Browse our fresh selection and place your first order!</p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-lime-600 transition shadow-sm flex items-center justify-center"
          >
            Explore Our Menu
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">My Order History</h1>
        </div>
        
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.orderStatus);
            const paymentInfo = getPaymentStatusInfo(order.paymentStatus);
            
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100 transform transition hover:shadow-md">
                <div className="p-4 bg-gradient-to-r from-green-50 to-lime-50 border-b border-green-100">
                  <div className="flex justify-between items-center flex-wrap gap-3">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Order ID</p>
                        <p className="font-medium text-gray-800">{order.razorpayOrderId.substring(0, 12)}...</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Ordered on</p>
                        <p className="font-medium text-gray-800">{formatDate(order.orderDateAndTime)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-green-100">
                  <div className={`flex items-center px-3 py-1.5 rounded-full border ${statusInfo.color}`}>
                    {statusInfo.icon}
                    <span className="font-medium">{order.orderStatus}</span>
                  </div>
                  
                  <div className={`flex items-center ${paymentInfo.color}`}>
                    {paymentInfo.icon}
                    <span className="font-medium">{order.paymentStatus}</span>
                  </div>
                </div>
              
                <div className="p-6">
                  <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-100">
                    <h3 className="font-semibold text-gray-800 flex items-center mb-3">
                      <MapPin className="h-4 w-4 text-green-600 mr-2" />
                      Delivery Details
                    </h3>
                    <div className="pl-6">
                      <p className="text-gray-700 mb-2">{order.userAddress}</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-green-500 mr-1.5" />
                          {order.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-green-500 mr-1.5" />
                          {order.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 flex items-center mb-4">
                      <ShoppingBag className="h-4 w-4 text-green-600 mr-2" />
                      Order Items
                    </h3>
                    
                    <div className="space-y-4">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="flex gap-4 p-3 rounded-lg hover:bg-green-50 transition-colors border border-gray-100">
                          <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/food-placeholder.png';
                                e.target.onerror = null;
                              }}
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                            <div className="mt-1">
                              <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-800">₹{item.price.toFixed(2)}</p>
                            <div className="mt-1 bg-green-100 rounded-full px-2 py-1 inline-block">
                              <p className="text-xs font-medium text-green-800">× {item.quantity || 1}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-green-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium text-gray-700">Total Bill:</span>
                      </div>
                      <span className="font-bold text-xl text-green-600">₹{order.amount.toFixed(2)}</span>
                    </div>
                    
                    <div className="mt-4 text-sm text-center text-gray-500 bg-green-50 p-2 rounded-lg">
                      {statusInfo.message}
                    </div>
                  </div>
                </div>

                {order.orderStatus === "Preparing" && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-lime-50 border-t border-green-100">
                    <button className="w-full py-3 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg font-medium hover:from-red-500 hover:to-red-700 transition shadow-sm flex items-center justify-center">
                      <X size={18} className="mr-2" />
                      Cancel Order
                    </button>
                  </div>
                )}
                
                {order.orderStatus === "Delivered" && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-lime-50 border-t border-green-100">
                    <button className="w-full py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-lime-600 transition shadow-sm flex items-center justify-center">
                      <RotateCcw size={18} className="mr-2" />
                      Reorder
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;