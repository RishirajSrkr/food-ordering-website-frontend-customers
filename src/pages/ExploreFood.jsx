import React, { useState } from 'react';
import FoodDisplay from '../components/FoodDisplay';
import { Search, Filter, X } from 'lucide-react';
import ExploreMenu from '../components/ExploreMenu';

function ExploreFood() {
  const [category, setCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Category Selection Swiper */}
      <ExploreMenu category={category} setCategory={setCategory} />
      
      {/* Search and Filter Section */}
      <div className="px-4 md:px-8 lg:px-12 pb-6 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search for fresh fruits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
              />
              {searchQuery && (
                <button 
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            {/* Category Dropdown */}
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select 
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                className="w-full appearance-none pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm bg-white"
              >
                <option value="ALL">All Categories</option>
                <option value="Citrus">Citrus</option>
                <option value="Berries">Berries</option>
                <option value="Tropical">Tropical</option>
                <option value="Stone Fruits">Stone Fruits</option>
                <option value="Melons">Melons</option>
                <option value="Apples">Apples</option>
                <option value="Grapes">Grapes</option>
                <option value="Exotic">Exotic</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Search Status */}
          {searchQuery && (
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span>Showing results for:</span>
              <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                "{searchQuery}"
              </span>
              <button 
                onClick={handleClearSearch}
                className="ml-2 text-green-600 hover:text-green-800 hover:underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Food Display Component */}
      <FoodDisplay category={category} searchQuery={searchQuery} />
    </div>
  );
}

export default ExploreFood;