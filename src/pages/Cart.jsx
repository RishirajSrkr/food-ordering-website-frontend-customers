import React from 'react'
import { useStoreContext } from '../context/StoreContext'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Apple, Truck } from 'lucide-react'
import { useNavigate } from 'react-router';
import { calculateCartTotals } from '../util/CartUtils';

function Cart() {
    const { quantities, foodList, incrementQty, decrementQty, removeFromCart } = useStoreContext();
    const navigate = useNavigate();

    const cartItems = foodList.filter(food => quantities[food.id] > 0);
    const { subTotal, shippingCharge, tax, totalAmount } = calculateCartTotals(cartItems, quantities);

    const formatPrice = (price) => {
        return price.toFixed(2);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header with back button */}
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        <span className="font-medium">Continue Shopping</span>
                    </button>
                    
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <ShoppingBag size={24} className="text-green-500 mr-2" />
                        Your Fruit Basket
                    </h2>
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-green-100">
                        <div className="w-24 h-24 bg-green-50 rounded-full mx-auto flex items-center justify-center mb-6">
                            <ShoppingBag size={40} className="text-green-300" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-700 mb-3">Your fruit basket is empty</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any fruits to your basket yet. Start exploring our juicy, farm-fresh options!</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-lime-600 transition-colors shadow-sm"
                        >
                            Browse Fruit Selection
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="w-full lg:w-2/3">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100">
                                <div className="p-4 border-b border-green-100 bg-green-50">
                                    <h3 className="font-medium text-gray-800 flex items-center">
                                        <Apple size={16} className="text-green-500 mr-2" />
                                        Fruits in Your Basket ({cartItems.length})
                                    </h3>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center hover:bg-green-50 transition-colors">
                                            <div className="flex-shrink-0 mb-4 sm:mb-0">
                                                <div className="h-24 w-24 sm:h-20 sm:w-20 overflow-hidden rounded-lg border border-gray-200">
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
                                            </div>

                                            <div className="sm:ml-4 flex-grow">
                                                <h4 className="font-medium text-gray-800">{item.name}</h4>
                                                <div className="flex items-center mt-1">
                                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">{item.category}</span>
                                                    <span className="text-gray-500 text-sm ml-2">&#8377; {formatPrice(item.price)} each</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4 sm:mt-0">
                                                <div className="flex items-center border border-gray-200 rounded-lg shadow-sm">
                                                    <button
                                                        onClick={() => decrementQty(item.id)}
                                                        className="p-2 rounded-l-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="px-4 py-2 text-gray-800 font-medium">{quantities[item.id]}</span>
                                                    <button
                                                        onClick={() => incrementQty(item.id)}
                                                        className="p-2 rounded-r-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart && removeFromCart(item.id)}
                                                    className="ml-4 p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            <div className="ml-0 sm:ml-8 mt-4 sm:mt-0 font-medium text-gray-800 text-right">
                                                &#8377; {formatPrice(quantities[item.id] * item.price)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4 border border-green-100">
                                <h3 className="font-bold text-xl mb-5 text-gray-800 pb-3 border-b border-green-100">Order Summary</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">&#8377; {formatPrice(subTotal)}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <Truck size={16} className="text-green-500 mr-2" />
                                            <span className="text-gray-600">Shipping</span>
                                        </div>
                                        {subTotal >= 500 ? (
                                            <span className="text-green-600 font-medium">Free</span>
                                        ) : (
                                            <span className="font-medium">&#8377; {formatPrice(shippingCharge)}</span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Tax (10%)</span>
                                        <span className="font-medium">&#8377; {formatPrice(tax)}</span>
                                    </div>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-800">Total</span>
                                        <span className="font-bold text-xl text-green-600">&#8377; {formatPrice(totalAmount)}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => navigate("/order")} 
                                    className="w-full bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center"
                                >
                                    Proceed to Checkout
                                </button>

                                <div className="mt-4 text-center text-sm text-gray-500 bg-green-50 p-3 rounded-lg">
                                    <p className="flex items-center justify-center">
                                        <Truck size={16} className="mr-2" />
                                        Free delivery on orders above &#8377; 500
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;