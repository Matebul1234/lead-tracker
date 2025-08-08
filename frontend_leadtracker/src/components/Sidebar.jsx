import React from 'react';
import {
  Calendar, LayoutDashboard, Users, Handshake, BarChart2, Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ showSidebar }) => {
  return (
    <div className={`sidebar col-auto d-flex flex-column px-2 py-4 ${showSidebar ? 'show' : ''}`}>
      <Link to="/dashboard" className="d-flex align-items-center gap-2 p-2">
        <LayoutDashboard size={25} /> Dashboard
      </Link>
      <Link to="/leads" className="d-flex align-items-center gap-2 p-2">
        <Users size={25} /> Lead
      </Link>
      <Link to="/ns3tech/quotation" className="d-flex align-items-center gap-2 p-2">
        <Handshake size={25} /> Quotation
      </Link>
      <Link to="" className="d-flex align-items-center gap-2 p-2">
        <BarChart2 size={25} /> Reports
      </Link>
      <Link to="" className="d-flex align-items-center gap-2 p-2">
        <Settings size={25} /> System
      </Link>
      <Link to="" className="d-flex align-items-center gap-2 p-2">
        <Calendar size={25} /> Events
      </Link>
    </div>
  );
};

export default Sidebar;
