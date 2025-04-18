import React, { useState } from 'react'
import ExploreMenu from '../components/ExploreMenu'
import ExploreFood from './ExploreFood'
import FoodDisplay from '../components/FoodDisplay'
import { useStoreContext } from '../context/StoreContext'
import { extractNameFromToken } from '../util/jwtUtils'

function Home() {

  const [category, setCategory] = useState("ALL")
  const { token } = useStoreContext();

 const name =  extractNameFromToken(token);
 

  return (
    <div>
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} searchQuery={""} />
    </div>
  )
}

export default Home