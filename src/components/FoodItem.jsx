import React from 'react'
import { Link } from 'react-router'
import { useStoreContext } from '../context/StoreContext'
import { Heart, Info, ShoppingBag, Plus, Minus } from 'lucide-react'

function FoodItem({ food }) {
  const { quantities, incrementQty, decrementQty } = useStoreContext();

  function handleIncrement() {
    incrementQty(food.id)
  }

  function handleDecrement() {
    decrementQty(food.id)
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 border border-green-100 shadow-sm hover:shadow-md group">
      <div className="relative">
        <img
          src={food?.imageUrl}
          alt={food.name}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = '/food-placeholder.png';
            e.target.onerror = null;
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="absolute top-3 left-3">
          <span className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-xs">
            {food.category}
          </span>
        </div>
        
        <button className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
          <Heart className="w-4 h-4 text-rose-500" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-bold text-gray-800">{food.name}</h2>
          <span className="bg-lime-50 text-lime-600 font-bold px-2 py-1 rounded text-sm">₹{food.price}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{food.description}</p>

        <div className="flex items-center gap-2">
          <Link
            to={`food/${food.id}`}
            className="flex-grow bg-white border border-green-300 hover:border-green-500 text-green-700 font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
          >
            <Info className="w-4 h-4" />
            <span>Details</span>
          </Link>

          {quantities[food.id] > 0 ? (
            <div className="flex items-center border border-green-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={handleDecrement}
                className="p-2 text-green-700 hover:bg-green-50 transition-colors duration-200"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 py-2 border-x border-green-200 font-medium text-gray-800 min-w-[36px] text-center">
                {quantities[food.id]}
              </span>
              <button
                onClick={handleIncrement}
                className="p-2 text-green-700 hover:bg-green-50 transition-colors duration-200"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleIncrement}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white rounded-lg shadow-sm flex items-center gap-2 transition-all duration-200"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodItem