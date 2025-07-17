import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../../assets/css/quotation.css';
import { Button } from 'primereact/button';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const Quotation_data_table = () => {

 const [visible, setVisible] = useState(false);
 const [products, setProducts] = useState([
  { code: 'P001', name: 'Small Widget', category: 'Size', quantity: 10 },
  { code: 'P002', name: 'Normal Widget', category: 'Size', quantity: 20 },
  { code: 'P003', name: 'Large Widget', category: 'Size', quantity: 15 }
 ]);


   const getLeadsbyemail = async () => {
    setTodayAllLeads([]);
    const useremail = localStorage.getItem('useremail');
    const response = await axios.post(`${API_URL}/api/lead/get-lead-by-email`, { email: useremail });
  //   setuserbasedLead(response.data);
  //   // console.log(response.data, "user based lead");


  // // Filter leads added today
  // const leadsAddedToday = response.data.filter(lead => isToday(lead.Date));
  //   // setTodayUserLeads(leadsAddedToday);
  //   setTodayAllLeads(leadsAddedToday);
  //   // console.log(leadsAddedToday, "Today's user-based leads");
  };

 
  const handleAddSuccess = () => {
    setVisible(false);
    getLeadsbyemail();
  };

 const actionBodyTemplate = (rowData) => {
  return (
   <div className="d-flex gap-2">
    <Button
     icon="pi pi-pencil"
     className="p-button-sm p-button-text edit-button"
    // onClick={() => handleEdit(rowData)}
    />
    <Button
     icon="pi pi-trash"
     className="p-button-sm p-button-danger p-button-text delete-button"
    // onClick={() => handleDelete(rowData.id)}

    // disabled={role !== 'admin'}
    />
    <Button icon="pi pi-plus" className="p-button-sm p-button-text add-button"
    // onClick={() => handleDownload(rowData)}
    />
   </div>
  );
 };

 return (
  <>
   <div className="py-3 px-4">
    <h1>Ns3TechSolutions Quotations</h1>
   </div>
   <div className="card">
    <DataTable value={products} stripedRows showGridlines
     tableStyle={{ minWidth: '50rem' }} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} className='custom-datatable'>
     <Column field="code" header="Code"></Column>
     <Column field="name" header="Name"></Column>
     <Column field="category" header="Category"></Column>
     <Column field="quantity" header="Quantity"></Column>
     <Column field='Amount' header='Amount'></Column>
     <Column body={actionBodyTemplate} header='Action' style={{ textAlign: 'right', width: '150px' }}></Column>
    </DataTable>

   </div>

     < Dialog
        header="Add Lead"
        visible={visible}
        maximizable
        style={{ width: window.innerWidth < 768 ? '95vw' : '50vw' }
        }
        onHide={() => setVisible(false)}
      >
        <LeadForm onSuccess={handleAddSuccess} leadData={selectedLead} />
      </Dialog >
  </>
 );
}

export default Quotation_data_table;
