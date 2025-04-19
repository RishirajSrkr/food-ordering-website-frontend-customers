import React, { useEffect, useState, useRef } from 'react'
import { categories as fruitCategories } from '../assets/assets'
import { useNavigate } from 'react-router'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Navigation } from 'swiper/modules'
import { Apple } from 'lucide-react'

function ExploreMenu({category, setCategory}) {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const navigationPrevRef = useRef(null)
  const navigationNextRef = useRef(null)
  let navigate = useNavigate();

  useEffect(() => {
    setCategories(fruitCategories)
  }, [])

  function handleCategoryClick(categoryName) {
    if(category === categoryName){
      setActiveCategory(null)
      setCategory("ALL")
    }
    else{
      setActiveCategory(categoryName)
      setCategory(categoryName)
    }
  }

  return (
    <div className="py-8 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="border-b border-green-200 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Apple className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="font-bold text-2xl text-gray-800">Seasonal Fruit Selection</h3>
            </div>
            <div className="flex gap-3">
              <button 
                ref={navigationPrevRef}
                className="bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-shadow duration-300 border border-green-100"
                aria-label="Previous categories"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                ref={navigationNextRef}
                className="bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-shadow duration-300 border border-green-100"
                aria-label="Next categories"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative">
            <Swiper
              spaceBetween={12}
              slidesPerView={2.5}
              breakpoints={{
                640: {
                  slidesPerView: 4,
                },
                768: {
                  slidesPerView: 5,
                },
                1024: {
                  slidesPerView: 6,
                },
                1280: {
                  slidesPerView: 8,
                }
              }}
              navigation={{
                prevEl: navigationPrevRef.current,
                nextEl: navigationNextRef.current,
              }}
              modules={[Navigation]}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = navigationPrevRef.current;
                swiper.params.navigation.nextEl = navigationNextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              className="category-swiper"
            >
              {categories.map((item, index) => (
                <SwiperSlide key={index}>
                  <div 
                    onClick={() => handleCategoryClick(item.id)}
                    className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-300 py-2 px-1 ${activeCategory === item.id ? 'scale-105' : 'opacity-90 hover:opacity-100'}`}
                  >
                    <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center p-1 mb-2 overflow-hidden bg-white shadow-sm ${activeCategory === item.id ? "border-2 border-green-500" : "border border-green-100"}`}>
                      <img 
                        src={item.icon} 
                        className={`object-contain transform transition-transform duration-500 hover:scale-110`} 
                        alt={item.categoryName} 
                      />
                    </div>
                    <h4 className={`font-medium text-sm sm:text-base text-center ${activeCategory === item.id ? 'text-green-600 font-semibold' : 'text-gray-700'}`}>
                      {item.categoryName}
                    </h4>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExploreMenu