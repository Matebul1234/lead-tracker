import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import Sidebar from './Sidebar';
import "../assets/css/dashboard.css";
import {
  Search, Plus, RefreshCw, Filter, List, MoreVertical, Phone, Heart, MessageCircle, Menu
} from 'lucide-react';
import { Dialog } from 'primereact/dialog';
import LeadForm from './LeadForm.jsx';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const TotalLead = () => {
  var useremail = localStorage.getItem('useremail');
  const toast = useRef(null);
  const [role, setRole] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [visible, setVisible] = useState(false);
  const [allLead, setallLead] = useState([]);
  const [userbasedLead, setuserbasedLead] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAllLead, setFilteredAllLead] = useState([]);
  const [filteredUserLead, setFilteredUserLead] = useState([]);


  // Fetch all leads
  const fetchalldata = async () => {
    const response = await axios.get(`${API_URL}/api/lead/get-allleads`);
    setallLead(response.data);
    // console.log(response.data, "all data of leads====", allLead);
  };

  // Fetch leads by user email
  const getLeadsbyemail = async () => {
    const response = await axios.post(`${API_URL}/api/lead/get-lead-by-email`, { email: useremail });
    setuserbasedLead(response.data);
    // console.log(response.data, "user based lead");
  };
  // Add New Lead 
  const addNewLead = () => {
    // console.log("function called");
    setSelectedLead(null);  // reset to empty before opening dialog
    setVisible(true);
  };


  // Edit table data
  const handleEdit = (lead) => {
    // console.log("Edit clicked", lead);
    setSelectedLead(lead);
    setVisible(true);
  };

  // Delete table row data using id 
  const handleDelete = async (id) => {
    // console.log("Deleting lead ID:", id);
    try {
      const response = await axios.delete(`${API_URL}/api/lead/delete-lead/${id}`);
      toast.current.show({ severity: 'success', summary: 'Deleted', detail: response.data.message, life: 3000 });
      fetchalldata();
      getLeadsbyemail();
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete lead';
      toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
    }
  };

  // search data in existing data 
  const searchInExistingData = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredAllLead(filterLeads(query, allLead));
    setFilteredUserLead(filterLeads(query, userbasedLead));
  };

  // filter data ====
  const filterLeads = (query, data) => {
    const lowerQuery = query.toLowerCase();
    return data.filter(item =>
      item.name?.toLowerCase().includes(lowerQuery) ||
      item.email?.toLowerCase().includes(lowerQuery) ||
      item.company_name?.toLowerCase().includes(lowerQuery) ||
      item.phone?.toString().includes(lowerQuery) ||
      item.country?.toLowerCase().includes(lowerQuery) ||
      item.state?.toLowerCase().includes(lowerQuery) ||
      item.city?.toLowerCase().includes(lowerQuery) ||
      item.industry_type?.toLowerCase().includes(lowerQuery) ||
      item.lead_status?.toLowerCase().includes(lowerQuery) ||
      item.lead_owner?.toLowerCase().includes(lowerQuery)
    );
  };



  // After adding/editing lead
  const handleAddSuccess = () => {
    setVisible(false);
    getLeadsbyemail();
  };

  useEffect(() => {
    const userrole = localStorage.getItem('userrole');
    setRole(userrole);
    fetchalldata();
    getLeadsbyemail();
  }, []);



  return (
    <>
      <Toast ref={toast} />
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <Sidebar showSidebar={showSidebar} />

          <div className="col p-3 mt-2">

            {/* Small screen sidebar toggle */}
            <div className="d-md-none mb-3">
              <button
                className="btn button-background btn-sm d-flex align-items-center gap-1"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <Menu size={18} /> Menu
              </button>
            </div>

            {/* Top summary cards */}
            <div className="row g-2 mb-3 py-3 img-fluid1 rounded">
              <div className="col-6 col-md-3 col-lg-2">
                <div className="bg-warning totalleadcard text-white rounded p-2 text-center">
                  <h4 className="fs-3">{userbasedLead.length}</h4>
                  <h5 className='fw-bold'>Total Leads</h5>
                </div>
              </div>
              <div className="col-6 col-md-3 col-lg-2">
                <div className="totalleadcard bg-success text-white rounded p-2 text-center">
                  <h4 className="fs-3">0</h4>
                  <h5 className='fw-bold'>Today Leads</h5>
                </div>
              </div>
              <div className="col-6 col-md-3 col-lg-2">
                <div className="totalleadcard bg-danger text-white rounded p-2 text-center">
                  <h4 className="fs-3">0</h4>
                  <h5 className='fw-bold'>Today Untouched Leads</h5>
                </div>
              </div>
              <div className="col-6 col-md-3 col-lg-2">
                <div className="totalleadcard bg-info text-white rounded p-2 text-center">
                  <h4 className="fs-3">0</h4>
                  <h5 className='fw-bold'>Today Assigned Leads</h5>
                </div>
              </div>
            </div>

            {/* Search & action buttons */}
            <div className="mb-2">
              <div className="row g-2">
                <div className="col-12 col-sm">
                  <div className="input-group input-group-sm w-50 md-m-auto">
                    <span className="input-group-text bg-white">
                      <Search size={16} />
                    </span>
                    <input type="text" className="form-control" placeholder="Search..." value={searchQuery}
                      onChange={searchInExistingData} />
                  </div>
                </div>
                <div className="col-12 col-md-auto">
                  <div className="d-flex flex-wrap gap-2">
                    <button className="btn btn-light btn-sm"><Filter size={16} /></button>
                    <button className="btn btn-primary btn-sm" onClick={addNewLead}><Plus size={16} /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive custom-table-responsive py-3">
              <table className="table table-hover align-middle shadow-sm rounded text-center">
                <thead className="table-success">
                  <tr>
                    <th><input type="checkbox" /></th>
                    <th>Fav</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Country</th>
                    <th>State</th>
                    <th>City</th>
                    <th>Industry Type</th>
                    <th>Lead Status</th>
                    <th>Lead Owner</th>
                    <th>Website Link</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(filteredUserLead.length > 0 ? filteredUserLead : userbasedLead).map((lead, idx) => (
                    <tr key={idx}>
                      <td><input type="checkbox" /></td>
                      <td><Heart size={16} color="#e74c3c" /></td>
                      <td className="fw-semibold">{lead.name}</td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <span>{lead.phone}</span>
                          <Phone size={14} className="text-primary" />
                          <MessageCircle size={14} className="text-success" />
                        </div>
                      </td>
                      <td>{lead.email}</td>
                      <td>{lead.company_name}</td>
                      <td>{lead.country}</td>
                      <td>{lead.state}</td>
                      <td>{lead.city}</td>
                      <td>{lead.industry_type}</td>
                      <td><span className="badge bg-info">{lead.lead_status}</span></td>
                      <td>{lead.lead_owner}</td>
                      <td>
                        <a href={lead.website_link} target="_blank" rel="noopener noreferrer" className="truncate-link">
                          {lead.website_link}
                        </a>
                      </td>
                      <td>{lead.Date ? new Date(lead.Date).toISOString().slice(0, 10) : ''}</td>
                      <td>{lead.description}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-light btn-sm" onClick={() => handleEdit(lead)}>Edit</button>
                          <button
                            className={`btn btn-danger btn-sm ${role === 'admin' ? '' : 'disabled'}`}
                            onClick={() => handleDelete(lead.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>



          </div>
        </div>
      </div>

      {/* Dialog box */}
      <Dialog
        header="Add Lead"
        visible={visible}
        maximizable
        style={{ width: window.innerWidth < 768 ? '95vw' : '50vw' }}
        onHide={() => setVisible(false)}
      >
        <LeadForm onSuccess={handleAddSuccess} leadData={selectedLead} />
      </Dialog>

    </>
  );
};

export default TotalLead;
