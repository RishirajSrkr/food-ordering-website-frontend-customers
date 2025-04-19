import React, { useState } from 'react';
import { useStoreContext } from '../context/StoreContext';
import { useNavigate } from 'react-router';
import { 
  Check, 
  Truck, 
  Clock, 
  ArrowRight, 
  CreditCard, 
  MapPin, 
  Apple, 
  Shield, 
  User, 
  Mail, 
  Phone, 
  Home, 
  Building, 
  MapPinned,
  ShoppingBag
} from 'lucide-react';
import { calculateCartTotals } from '../util/CartUtils';
import axios from 'axios';

function PlaceOrder() {
    const navigate = useNavigate();
    const { quantities, foodList, token } = useStoreContext();

    const cartItems = foodList.filter(food => quantities[food.id] > 0);
    const { subTotal, shippingCharge, tax, totalAmount } = calculateCartTotals(cartItems, quantities);

    // Estimated delivery time (random between 30-45 mins)
    const deliveryMinutes = Math.floor(Math.random() * 15) + 30;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
        paymentMethod: 'razorpay',
        specialInstructions: ''
    });

    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when field is being edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // Validate form before submission
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.pincode.trim()) {
            newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'Pincode must be 6 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const orderData = {
            userAddress: `${formData.name}, ${formData.address}, ${formData.city}, ${formData.pincode}`,
            phoneNumber: formData.phone,
            email: formData.email,
            orderedItems: cartItems.map(item => ({
                foodId: item.id,
                name: item.name,
                quantity: quantities[item.id],
                price: item.price * quantities[item.id],
                category: item.category,
                imageUrl: item.imageUrl,
                description: item.description,
                specialInstructions: formData.specialInstructions,
            })),
            amount: totalAmount.toFixed(2),
            orderStatus: "Preparing"
        };

        try {
            setIsProcessing(true);
            
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, orderData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200 && response.data.razorpayOrderId) {
                initiatePayment(response.data);
            }
            else {
                throw new Error("Failed to place order. Please try again.");
            }
        }
        catch (error) {
            setIsProcessing(false);
            console.error("Error placing order:", error);
            alert("Error placing order: " + (error.message || "Please try again"));
        }
    };

    const initiatePayment = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount: order.amount * 100,
            currency: "INR",
            name: "FreshFruit",
            description: "Fresh Fruit Order Payment",
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone
            },
            notes: {
                address: formData.address
            },
            theme: {
                color: "#4ade80"
            },
            modal: {
                ondismiss: async function () {
                    setIsProcessing(false);
                    await deleteOrder(order.id);
                }
            },
            order_id: order.razorpayOrderId,
            handler: async function (razorpayResponse) {
                await verifyPayment(razorpayResponse);
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const verifyPayment = async (razorpayResponse) => {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = razorpayResponse;

        const paymentData = {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        };
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders/verify`, paymentData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                await clearCart();
                navigate('/my-orders');
            }
            else {
                throw new Error("Failed to verify payment. Please try again.");
            }
        }
        catch (error) {
            console.error("Error verifying payment:", error);
            alert("Payment verification failed. Please try again.");
        }
        finally {
            setIsProcessing(false);
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
        }
        catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/carts`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
        }
        catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    // Format price with commas
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(price);
    };

    return (
        <div className="bg-gradient-to-b from-green-50 to-white min-h-screen py-8 px-4">
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Form Column */}
                    <div className="w-full lg:w-3/5">
                        <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                            <Apple className="mr-2 text-green-500" size={24} />
                            Complete Your Order
                        </h1>

                        {/* Progress Steps */}
                        <div className="flex justify-between mb-8 relative">
                            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200">
                                <div className="h-full bg-green-500 w-2/3"></div>
                            </div>
                            <div className="flex flex-col items-center relative z-10">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm">
                                    <ShoppingBag size={16} />
                                </div>
                                <span className="mt-2 text-sm">Fruit Basket</span>
                            </div>
                            <div className="flex flex-col items-center relative z-10">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm">
                                    <MapPin size={16} />
                                </div>
                                <span className="mt-2 text-sm font-medium">Delivery</span>
                            </div>
                            <div className="flex flex-col items-center relative z-10">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    <CreditCard size={16} />
                                </div>
                                <span className="mt-2 text-sm text-gray-500">Payment</span>
                            </div>
                        </div>

                        {/* Order Form */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
                            <div className="mb-6">
                                <h2 className="text-lg font-medium mb-4 flex items-center text-gray-800 pb-2 border-b border-green-100">
                                    <MapPin className="mr-2 text-green-500" size={20} />
                                    Delivery Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="name">
                                            <div className="flex items-center">
                                                <User size={16} className="mr-1.5 text-green-500" />
                                                Full Name*
                                            </div>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all`}
                                            placeholder="John Doe"
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="email">
                                            <div className="flex items-center">
                                                <Mail size={16} className="mr-1.5 text-green-500" />
                                                Email Address*
                                            </div>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all`}
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="phone">
                                            <div className="flex items-center">
                                                <Phone size={16} className="mr-1.5 text-green-500" />
                                                Phone Number*
                                            </div>
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all`}
                                            placeholder="1234567890"
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="address">
                                            <div className="flex items-center">
                                                <Home size={16} className="mr-1.5 text-green-500" />
                                                Delivery Address*
                                            </div>
                                        </label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all`}
                                            placeholder="123 Main St, Apartment 4B"
                                            rows="2"
                                        ></textarea>
                                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="city">
                                            <div className="flex items-center">
                                                <Building size={16} className="mr-1.5 text-green-500" />
                                                City*
                                            </div>
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={`w-full p-3 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all`}
                                            placeholder="Mumbai"
                                        />
                                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                    </div>

                                    {/* Pincode */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="pincode">
                                            <div className="flex items-center">
                                                <MapPinned size={16} className="mr-1.5 text-green-500" />
                                                Pincode*
                                            </div>
                                        </label>
                                        <input
                                            type="text"
                                            id="pincode"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            className={`w-full p-3 border rounded-lg ${errors.pincode ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all`}
                                            placeholder="400001"
                                        />
                                        {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Special Instructions */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor="specialInstructions">
                                    <div className="flex items-center">
                                        <Apple size={16} className="mr-1.5 text-green-500" />
                                        Special Instructions (Optional)
                                    </div>
                                </label>
                                <textarea
                                    id="specialInstructions"
                                    name="specialInstructions"
                                    value={formData.specialInstructions}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all"
                                    placeholder="Add any special delivery instructions, allergies, or preferences for fruit ripeness."
                                    rows="2"
                                ></textarea>
                            </div>

                            {/* Payment Method */}
                            <div className="mb-6">
                                <h2 className="text-lg font-medium mb-4 flex items-center text-gray-800 pb-2 border-b border-green-100">
                                    <CreditCard className="mr-2 text-green-500" size={20} />
                                    Payment Method
                                </h2>

                                <div className="space-y-3">
                                    <div className={`flex items-center p-3 border rounded-lg hover:bg-green-50 cursor-pointer transition-all ${formData.paymentMethod === 'razorpay' ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            id="razorpay"
                                            name="paymentMethod"
                                            value="razorpay"
                                            checked={formData.paymentMethod === 'razorpay'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-green-500 focus:ring-green-400"
                                        />
                                        <label htmlFor="razorpay" className="ml-2 flex-grow cursor-pointer">
                                            Pay Online (Razorpay)
                                            <p className="text-xs text-gray-500 mt-1">Credit/Debit Cards, UPI, Net Banking & more</p>
                                        </label>
                                        <div className="flex space-x-1">
                                            <div className="h-6 w-10 bg-blue-500 rounded-md"></div>
                                            <div className="h-6 w-10 bg-green-500 rounded-md"></div>
                                            <div className="h-6 w-10 bg-yellow-500 rounded-md"></div>
                                        </div>
                                    </div>

                                    <div className={`flex items-center p-3 border rounded-lg hover:bg-green-50 cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            id="cod"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-green-500 focus:ring-green-400"
                                        />
                                        <label htmlFor="cod" className="ml-2 flex-grow cursor-pointer">
                                            Cash On Delivery
                                            <p className="text-xs text-gray-500 mt-1">Pay when your fruits arrive</p>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white py-4 rounded-lg font-medium transition-all flex items-center justify-center shadow-sm"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </div>
                                ) : (
                                    <>
                                        Place Order • ₹{formatPrice(totalAmount)}
                                        <ArrowRight className="ml-2" size={18} />
                                    </>
                                )}
                            </button>

                            <p className="text-sm text-gray-500 mt-4 text-center">
                                By placing your order, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </form>
                    </div>

                    {/* Order Summary Column */}
                    <div className="w-full lg:w-2/5">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100 sticky top-4">
                            <h2 className="text-lg font-bold mb-4 flex items-center text-gray-800 pb-2 border-b border-green-100">
                                <ShoppingBag className="mr-2 text-green-500" size={20} />
                                Order Summary
                            </h2>

                            {/* Item List */}
                            <div className="max-h-64 md:max-h-96 overflow-y-auto mb-6 pr-2">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center py-3 border-b border-gray-100">
                                        <div className="h-16 w-16 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.name} 
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = '/fruit-placeholder.png';
                                                    e.target.onerror = null;
                                                }}
                                            />
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-sm text-gray-500">{quantities[item.id]} × ₹{formatPrice(item.price)}</span>
                                                <span className="font-medium text-gray-800">₹{formatPrice(item.price * quantities[item.id])}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Delivery Info */}
                            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
                                <div className="flex items-center mb-2 text-gray-800">
                                    <Clock size={16} className="mr-2 text-green-600" />
                                    <span className="font-medium">Estimated Delivery: {deliveryMinutes} mins</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <Truck size={16} className="mr-2 text-green-600" />
                                    <span className="text-sm">
                                        {subTotal > 500 ? "Free delivery on your order!" : "Free delivery on orders above ₹500"}
                                    </span>
                                </div>
                            </div>

                            {/* Price Details */}
                            <div className="space-y-3 text-sm border-t border-green-100 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Item Total</span>
                                    <span className="text-gray-800">₹{formatPrice(subTotal)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Taxes (10%)</span>
                                    <span className="text-gray-800">₹{formatPrice(tax)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery Charge</span>
                                    {shippingCharge === 0 ? (
                                        <span className="text-green-600 font-medium">FREE</span>
                                    ) : (
                                        <span className="text-gray-800">₹{formatPrice(shippingCharge)}</span>
                                    )}
                                </div>

                                <div className="flex justify-between border-t border-green-100 pt-3 mt-3 font-bold text-base">
                                    <span className="text-gray-800">Total</span>
                                    <span className="text-green-600">₹{formatPrice(totalAmount)}</span>
                                </div>

                                {subTotal > 0 && subTotal < 500 && (
                                    <div className="text-xs text-green-600 mt-2 bg-green-50 p-2 rounded-lg">
                                        Add items worth ₹{formatPrice(500 - subTotal)} more for free delivery!
                                    </div>
                                )}
                            </div>

                            {/* Safe & Secure */}
                            <div className="flex justify-center items-center mt-6 bg-gray-50 p-2 rounded-lg">
                                <Shield className="h-4 w-4 text-gray-500 mr-1.5" />
                                <span className="text-xs text-gray-500">100% Safe & Secure Payments</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaceOrder;