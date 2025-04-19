import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useStoreContext } from '../context/StoreContext'
import { 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Heart, 
  ChevronsUp, 
  Apple,
  Clock,
  Tag,
  Loader,
  Check
} from 'lucide-react'

function FoodDetails() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const { foodList, quantities, incrementQty, decrementQty } = useStoreContext();
  
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedItems, setRelatedItems] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchFoodDetails();
    // Scroll to top when component mounts or foodId changes
    window.scrollTo(0, 0);
  }, [foodId]);

  function fetchFoodDetails() {
    setLoading(true);
    
    // Find the food item from the context
    const foundFood = foodList.find(item => item.id === foodId);
    
    if (foundFood) {
      setFood(foundFood);
      
      // Find related foods in the same category
      const related = foodList
        .filter(item => item.category === foundFood.category && item.id !== foodId)
        .slice(0, 4);
      setRelatedItems(related);
    }
    
    setLoading(false);
  }

  function handleIncrement() {
    incrementQty(foodId);
  }

  function handleDecrement() {
    decrementQty(foodId);
  }

  function handleAddToCart() {
    if (quantities[foodId] === 0) {
      incrementQty(foodId);
    }
    navigate("/cart");
  }

  function toggleFavorite() {
    setIsFavorite(!isFavorite);
    // In a real app, you'd save this to user preferences
  }

  function goBack() {
    navigate(-1);
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Loader className="h-12 w-12 text-green-500 animate-spin mb-4" />
        <div className="text-lg text-gray-600">Loading fresh details...</div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="flex flex-col justify-center items-center h-96 px-4">
        <div className="bg-red-100 rounded-full p-4 mb-4">
          <ChevronsUp className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center">Fruit not found</h2>
        <p className="text-gray-600 mb-6 text-center">The fruit you're looking for might be out of season or is temporarily unavailable.</p>
        <button 
          onClick={goBack}
          className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white px-6 py-3 rounded-lg transition-colors shadow-sm flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Browse Other Fruits
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <button 
          onClick={goBack}
          className="flex items-center text-gray-600 hover:text-green-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span className="font-medium">Back to Selection</span>
        </button>

        {/* Main content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden md:flex border border-green-100">
          {/* Food image */}
          <div className="relative md:w-1/2 h-72 sm:h-96 md:h-auto">
            <img 
              src={food.imageUrl} 
              alt={food.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/fruit-placeholder.png';
                e.target.onerror = null;
              }}
            />
            <button 
              onClick={toggleFavorite}
              className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full shadow-sm hover:bg-white transition-colors"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
            <div className="absolute top-4 left-4">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full">
                {food.category}
              </span>
            </div>
          </div>

          {/* Food details */}
          <div className="p-6 md:p-8 md:w-1/2">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{food.name}</h1>
              <span className="bg-green-50 text-green-600 font-bold px-3 py-1.5 rounded-lg text-lg">
                ₹{food.price}
              </span>
            </div>

            <div className="flex items-center mb-6 text-sm text-gray-500">
              <div className="flex items-center mr-4">
                <Clock className="h-4 w-4 mr-1 text-green-500" />
                <span>30-45 min delivery</span>
              </div>
              <div className="flex items-center">
                <Apple className="h-4 w-4 mr-1 text-green-500" />
                <span>Farm-fresh produce</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {food.description}
            </p>

            {food.nutrition && (
              <div className="mb-8">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-green-500" />
                  Nutrition Facts
                </h3>
                <div className="flex flex-wrap gap-2">
                  {food.nutrition.map((item, index) => (
                    <span 
                      key={index} 
                      className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 pt-6 mb-6">
              {/* Quantity selector */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center">
                  <span className="text-gray-700 mr-3">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <button 
                      onClick={handleDecrement}
                      disabled={!quantities[foodId] || quantities[foodId] <= 0}
                      className={`px-3 py-2 transition-colors ${!quantities[foodId] || quantities[foodId] <= 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="px-4 py-2 font-medium text-gray-800 min-w-[40px] text-center border-x border-gray-200">
                      {quantities[foodId] || 0}
                    </span>
                    
                    <button 
                      onClick={handleIncrement}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-500 flex items-center">
                  {food.isOrganic && (
                    <div className="flex items-center mr-3">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                      <span>Organic</span>
                    </div>
                  )}
                  {food.isSeasonalPick && (
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-lime-500 mr-1"></div>
                      <span>Seasonal Pick</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add to cart button */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white font-medium py-3.5 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              {quantities[foodId] > 0 ? 'View in Basket' : 'Add to Basket'}
            </button>
            
            {quantities[foodId] > 0 && (
              <div className="mt-3 bg-green-50 rounded-lg p-3 flex items-center justify-center text-sm text-green-700">
                <Check className="h-4 w-4 mr-2" />
                {quantities[foodId]} {quantities[foodId] > 1 ? 'items' : 'item'} already in your fruit basket
              </div>
            )}
          </div>
        </div>

        {/* Related items */}
        {relatedItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <Apple className="h-5 w-5 mr-2 text-green-500" />
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-green-100 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => navigate(`/food/${item.id}`)}
                >
                  <div className="relative h-48">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/fruit-placeholder.png';
                        e.target.onerror = null;
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-medium">₹{item.price}</span>
                      <button className="bg-green-50 hover:bg-green-100 text-green-600 p-1.5 rounded-full transition-colors">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodDetails