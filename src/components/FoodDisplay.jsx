import React, { useEffect, useState } from 'react'
import { useStoreContext } from '../context/StoreContext'
import FoodItem from './FoodItem';
import { Apple, Banana } from 'lucide-react';

function FoodDisplay({ category, searchQuery }) {
  const { foodList } = useStoreContext();
  const [filteredFoodList, setFilteredFoodList] = useState([]);

  useEffect(() => {
    if (foodList && foodList.length > 0) {
      if (category === "ALL") {
        if (searchQuery) {
          const filteredFoods = foodList.filter(food =>
            (
              food.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            ||
            (
              searchQuery.toLowerCase().includes(food.category.toLowerCase())
            )
          );
          setFilteredFoodList(filteredFoods)
        }
        else setFilteredFoodList(foodList);

      } else {
        const filteredFoods = foodList.filter(food =>
          (
            food.category && food.category.toLowerCase() === category.toLowerCase()
          )
          &&
          (
            !searchQuery || food.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
        setFilteredFoodList(filteredFoods);
      }
    }
  }, [foodList, category, searchQuery]);

  return (
    <div className="bg-gradient-to-b from-white to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-2">
          <Apple className="h-6 w-6 text-green-500 mr-2" />
          <h1 className="text-3xl font-bold text-green-600">Fresh Fruits</h1>
        </div>
        
        <p className="text-gray-600 mb-8 pl-8">
          {category === "ALL" ? 
            "Discover our selection of juicy, farm-fresh fruits delivered to your doorstep" : 
            `Browsing ${category} fruits - hand-picked at peak ripeness for maximum flavor`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoodList && filteredFoodList.length > 0 ? (
            filteredFoodList.map((food, index) => (
              <FoodItem food={food} key={index} />
            ))
          ) : (
            category !== "ALL" ? (
              <div className="col-span-3 text-center py-12 bg-white rounded-xl border border-green-100 shadow-sm">
                <Banana className="h-16 w-16 text-green-200 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No fruits found in this category.</p>
                <p className="text-gray-400 text-sm">Try another category or check back soon for seasonal arrivals!</p>
              </div>
            ) : (
              <div className="col-span-3 text-center py-12 bg-white rounded-xl border border-green-100 shadow-sm">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 mb-4"></div>
                  <div className="h-4 bg-green-100 rounded w-48 mb-2"></div>
                  <div className="h-3 bg-green-50 rounded w-32"></div>
                </div>
                <p className="text-gray-500 text-lg mt-4">Loading delicious fruit options...</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodDisplay;