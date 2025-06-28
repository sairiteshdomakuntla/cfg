import React from 'react'
import { AppContext } from '../context/AppContext';

const Test = () => {
  const {isLoggedIn, setIsLoggedIn, role, setRole, user, setUser} = React.useContext(AppContext);
  console.log('isLoggedIn:', isLoggedIn);
  return (
    <div>
      {isLoggedIn}
    </div>
  )
}

export default Test
