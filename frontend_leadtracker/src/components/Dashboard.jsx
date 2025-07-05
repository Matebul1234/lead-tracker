import React, { useEffect, useState } from 'react';
import "../assets/css/home.css";
import '../assets/css/dashboard.css';
import {
  Calendar, User, Phone, Check, X, Menu,
  Heart, CalendarHeart
} from 'lucide-react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
    const [allLead, setallLead] = useState([]);
  

   // Fetch all leads
  const fetchalldata = async () => {
    const response = await axios.get(`${API_URL}/api/lead/get-allleads`);
    setallLead(response.data);
    // console.log(response.data, "all data of leads====", allLead);
  };

  const cards = [
    { icon: <Heart size={25} />, count: 0, title: 'My Favourites' ,redirectLink:'/total-leads' },
    { icon: <CalendarHeart size={25} />, count: 0, title: 'Today Leads' ,redirectLink:'/' },
    { icon: <Calendar size={25} />, count:`${allLead.length}`, title: 'Total Leads' ,redirectLink:'/total-leads' },
    { icon: <User size={25} />, count: 0, title: 'Today Walk-In' ,redirectLink:'/' },
    { icon: <Calendar size={25} />, count: 0, title: 'Missed Follow up' ,redirectLink:'/' },
    { icon: <Calendar size={25} />, count: 0, title: 'Today assigned leads' ,redirectLink:'/' },
    { icon: <Phone size={25} />, count: 0, title: 'Yesterday Call' ,redirectLink:'/' },
    { icon: <Check size={25} />, count: 0, title: 'Completed Leads' ,redirectLink:'/' },
    { icon: <X size={25} />, count: 0, title: 'Yesterday Untouched Leads' ,redirectLink:'/' },
  ];

  useEffect(()=>{
    fetchalldata();
  },[]);



  return (
    <div className="container-fluid" style={{ backgroundColor: '#f3f8fe' }}>
      <div className="row flex-nowrap">

        <Sidebar showSidebar={showSidebar} />

        {/* Main content */}
        <div className="col p-3 mt-3">
          {/* Menu button visible only on small screens */}
          <div className="d-md-none mb-3">
            <button
              className="btn button-background d-flex align-items-center gap-2"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu size={20} /> Menu
            </button>
          </div>

          {/* Cards grid */}
          <div className="row g-3">
            {cards.map((card, idx) => (
              <div className="col-12 col-sm-6 col-md-4" key={idx}>
                <div className="card card-hover p-3 d-flex flex-row align-items-center justify-content-between shadow" onClick={() => navigate(card.redirectLink)}>
                  <div className="d-flex align-items-center">
                    <div className="card-icon me-2 shadow">
                      {card.icon}
                    </div>
                  </div>
                  <div className='text-center m-auto'>
                    <h2 className="mb-1 text-underline">{card.count}</h2>
                    <h5 className='fw-bold'>{card.title}</h5>
                  </div>
                  <button  className="btn button-bg-color btn-sm btn-view">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
