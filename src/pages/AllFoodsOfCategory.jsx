import React from 'react'
import { useParams } from 'react-router'

function AllFoodsOfCategory() {
    const {categoryName} = useParams();
    console.log(categoryName);
    
  return (
    <div className='flex items-center justify-center w-full h-screen'>
        <h3>{categoryName.toUpperCase()}</h3>
    </div>
  )
}

export default AllFoodsOfCategory