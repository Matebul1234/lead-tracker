import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Toast } from 'primereact/toast';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import LeadForm from './LeadForm';
import '../assets/css/dashboard.css';
import Sidebar from './Sidebar';
import { Filter, Heart, Menu, MessageCircle, Phone, Plus, Search } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function UserLeadsTable() {
  const [leads, setLeads] = useState([]);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [role, setRole] = useState(null);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [allLead, setallLead] = useState([]);
  const [userbasedLead, setuserbasedLead] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const [todayAllLeads, setTodayAllLeads] = useState([]);

  const fetchLeads = async () => {
    setLoading(true);
    const email = localStorage.getItem('useremail');

    const userRole = localStorage.getItem('userrole');
    setRole(userRole);

    try {
      if (!userRole) {
        const response = await axios.post(`${API_URL}/api/lead/get-lead-by-email`, { email });
        setLeads(response.data);
      } else {
        const response = await axios.get(`${API_URL}/api/lead/get-allleads`);
        setLeads(response.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    initFilters();
  }, []);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      lead_status: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
    setGlobalFilterValue('');
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-GB'); // dd/mm/yyyy
  };

  const getSeverity = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'new':
        return 'info';
      case 'contacted':
        return 'success';
      case 'closed':
        return 'danger';
      default:
        return null;
    }
  };

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.lead_status} severity={getSeverity(rowData.lead_status)} />;
  };

  // search data in existing data 
  const searchInExistingData = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredAllLead(filterLeads(query, allLead));
    setFilteredUserLead(filterLeads(query, userbasedLead));
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="d-flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-sm p-button-text"
          onClick={() => handleEdit(rowData)}

        />
        <Button
          icon="pi pi-trash"
          className="p-button-sm p-button-danger p-button-text"
          onClick={() => handleDelete(rowData.id)}

          disabled={role !== 'admin'}
        />
      </div>
    );
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setVisible(true);
  };


  // Fetch leads by user email
  const getLeadsbyemail = async () => {
    setTodayAllLeads([]);
    const useremail = localStorage.getItem('useremail');
    const response = await axios.post(`${API_URL}/api/lead/get-lead-by-email`, { email: useremail });
    setuserbasedLead(response.data);
    // console.log(response.data, "user based lead");


    // Filter leads added today
    const leadsAddedToday = response.data.filter(lead => isToday(lead.Date));
    // setTodayUserLeads(leadsAddedToday);
    setTodayAllLeads(leadsAddedToday);
    // console.log(leadsAddedToday, "Today's user-based leads");
  };

  // Fetch all leads
  const fetchalldata = async () => {
    const response = await axios.get(`${API_URL}/api/lead/get-allleads`);
    setallLead(response.data);
    // console.log(response.data, "all data of leads====", allLead);

    // Filter leads added today
    const leadsAddedToday = response.data.filter(lead => isToday(lead.Date));
    setTodayAllLeads(leadsAddedToday);
    // console.log(leadsAddedToday, "Today's all leads");
  };

  // Function to check if the lead is added today
  const isToday = (dateString) => {
    const leadDate = new Date(dateString);
    const today = new Date();

    return (
      leadDate.getFullYear() === today.getFullYear() &&
      leadDate.getMonth() === today.getMonth() &&
      leadDate.getDate() === today.getDate()
    );
  };

  const handleAddSuccess = () => {
    setVisible(false);
    getLeadsbyemail();
  };

  // Add New Lead 
  const addNewLead = () => {
    // console.log("function called");
    setSelectedLead(null);  // reset to empty before opening dialog
    setVisible(true);
  };

  useEffect(() => {
    const userrole = localStorage.getItem('userrole');
    setRole(userrole);
    fetchalldata();
    getLeadsbyemail();
  }, []);
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/lead/delete-lead/${id}`);
      toast.current.show({ severity: 'success', summary: 'Deleted', detail: response.data.message, life: 3000 });
      fetchLeads();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete lead';
      toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
    }
  };

  // INSIDE your component
  const header = (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
      <Button
        type="button"
        icon="pi pi-filter-slash"
        label="Clear"
        outlined
        onClick={clearFilter}
      />
      <div className="d-flex align-items-center gap-2 ms-auto">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search leads..."
          />
        </IconField>
        <Button icon="pi pi-plus" onClick={addNewLead} tooltip="Add Lead" />
      </div>
    </div>
  );


  return (
    <>

      {/* new div */}
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
                  <h4 className="fs-3">{todayAllLeads.length}</h4>
                  <h5 className='fw-bold'>Today Leads</h5>
                </div>
              </div>
              {/* <div className="col-6 col-md-3 col-lg-2">
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
              </div> */}
            </div>


            {/* Table */}
            <div className="table-responsive custom-table-responsive py-3">
              <DataTable
                value={userbasedLead}
                paginator
                rows={7}
                rowsPerPageOptions={[5, 10, 25, 50]}
                loading={loading}
                dataKey="id"
                filters={filters}
                globalFilterFields={[
                  'name',
                  'email',
                  'company_name',
                  'lead_owner',
                  'industry_type',
                  'country',
                  'state',
                  'city',
                  'lead_status',
                ]}
                header={header}
                emptyMessage="No leads found."
                showGridlines
                stripedRows
                scrollable
                scrollHeight="500px"
                paginatorPosition="bottom"
                className="p-datatable-sm p-datatable-bordered"
              >

              <Column field="name" header="Name" sortable style={{ minWidth: '12rem' }} />
              <Column field="email" header="Email" sortable style={{ minWidth: '12rem' }} />
              <Column field="phone" header="Phone" sortable style={{ minWidth: '10rem' }} />
              <Column field="company_name" header="Company" sortable style={{ minWidth: '14rem' }} />
              <Column field="industry_type" header="Industry" sortable style={{ minWidth: '12rem' }} />
              <Column field="country" header="Country" sortable style={{ minWidth: '10rem' }} />
              <Column field="state" header="State" sortable style={{ minWidth: '10rem' }} />
              <Column field="lead_owner" header="Lead Owner" sortable style={{ minWidth: '10rem' }} />
              <Column
                field="lead_status"
                header="Status"
                body={statusBodyTemplate}
                style={{ minWidth: '10rem' }}
              />
              <Column field="city" header="City" sortable style={{ minWidth: '10rem' }} />
              <Column
                field="website_link"
                header="Website"
                style={{ minWidth: '14rem' }}
                body={(rowData) => (
                  <a href={rowData.website_link} target="_blank" rel="noreferrer">{rowData.website_link}</a>
                )}
              />
              <Column
                field="Date"
                header="Date"
                body={(rowData) => formatDate(rowData.Date)}
                style={{ minWidth: '10rem' }}
              />
              <Column field="description" header="Description" style={{ minWidth: '16rem' }} />
              <Column
                header="Actions"
                body={actionBodyTemplate}
                style={{ minWidth: '8rem', textAlign: 'center' }}
              />
            </DataTable>
          </div>
        </div>
      </div>
    </div >

      {/* Dialog box */ }
      < Dialog
  header = "Add Lead"
  visible = { visible }
  maximizable
  style = {{ width: window.innerWidth < 768 ? '95vw' : '50vw' }
}
onHide = {() => setVisible(false)}
      >
  <LeadForm onSuccess={handleAddSuccess} leadData={selectedLead} />
      </Dialog >
    </>
  );
}
