import React from 'react'
import "../assets/css/thanku.css"
import { Link } from 'react-router-dom'

const ThankU = () => {
 return (
  <>
   <div className="content py-4 px-4">
    <div className="wrapper-1">
     <div className="wrapper-2">
      <h1 className="thanku">Thank you !😊</h1>
      <p>Thanks for Applying our Team</p>
      <p>will Contact you soon... 😊 </p>
      <Link to="/">
      <button className="go-home">
       go home
      </button>
      </Link>
     </div>

    </div>
   </div>
  </>
 )
}

export default ThankU
