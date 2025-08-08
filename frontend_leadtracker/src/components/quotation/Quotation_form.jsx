import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const QuatationForm = ({ onSuccess, quotation }) => {

  const formRef = useRef(null);
  const useremail = localStorage.getItem('useremail');

  // console.log(useremail,"useremail in quotation form")


  const [selectedDate, setSelectedDate] = useState(new Date());
  const [errors, setErrors] = useState({});

  const API_URL = import.meta.env.VITE_API_URL;
  const toast = useRef(null);



const [formData, setFormData] = useState({
  description: '',
  quantity: '',
  unit_price: '',
});

const [amount, setAmount] = useState(0);

const handleChange = (e) => {
  const { name, value } = e.target;
  const newFormData = { ...formData, [name]: value };

  setFormData(newFormData);

  const qty = parseFloat(newFormData.quantity) || 0;
  const price = parseFloat(newFormData.unit_price) || 0;
  setAmount(qty * price);
};

const gst = (amount * 18) / 100;
const grandTotal = amount + gst;


  const validate = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = 'description is Required';
    if (!formData.unit_price.trim()) newErrors.unit_price = 'Unit Price is Required';
    if (!formData.amount.trim()) newErrors.company_name = 'Amount is Required';

    return newErrors;
  };


  /// test 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        phone,
        date: selectedDate,

      };
      if (quotation) {
        await axios.put(`${API_URL}/api/quatation/${quotation.id}`, payload);
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'quotation updated successfully!',
          life: 3000,
        });
      } else {
        await axios.post(`${API_URL}/api/quotation`, payload);
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'quotation created successfully!',
          life: 3000,
        });
      }

      // clear form
      setFormData({
        description: '',
        quantity: '',
        unit_price: '',
        amount: '',
        bill_to_description: ''
      });
      setPhone('');
      setSelectedDate(new Date());
      setErrors({});
      onSuccess && onSuccess();

    } catch (error) {
      console.error('Error:', error);
      const message = error.response?.data?.message || 'Something went wrong';
      const status = error.response?.status;
      if (status === 409) {
        toast.current?.show({ severity: 'warn', summary: 'Duplicate quotation', detail: message, life: 3000 });
      } else if (status === 400) {
        toast.current?.show({ severity: 'warn', summary: 'Validation Error', detail: message, life: 3000 });
      } else {
        toast.current?.show({ severity: 'error', summary: 'Server Error', detail: message, life: 3000 });
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  // Download the quotation form as a PDF file.
  const handleDownloadPDF = async () => {
    const element = formRef.current;
    // Convert the HTML element to a canvas and then to a PNG image
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    // Create a new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Get the image properties
    const imgProps = pdf.getImageProperties(imgData);

    // Set the PDF width to the image width, and calculate the height based on the image aspect ratio
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Save the PDF with the name "quotation.pdf"
    pdf.save('quotation.pdf');
  };




  return (
    <>
      <Toast ref={toast} />
      <div className="d-flex justify-content-center align-items-center p-4">
        <div className=" w-100" >
          <div className="card px-4 py-3 w-100 shadow rounded-4" ref={formRef}>

            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3">
              <div>
                <img src="/colorLogo.webp" alt="Logo" width="120px" className="object-fit-cover" />
                <p className="mb-0 mt-2 fw-bold">NS3TechSolutions Pvt Ltd:</p>
                <p className="mb-0 small">B9-301, Old Dlf, Sector-14, Gurgaon-122001</p>
                <p className="mb-0 small">sales@ns3techsolutions.com</p>
                <p className="mb-0 small">+91-70093-19674</p>
                <p className="mb-0 small">GSTIN: 06AACGN5859A1ZF</p>
              </div>
              <div className="text-start">
                <h2 className="fw-bold" style={{ color: '#021c6e' }}>QUOTATION</h2>
                <div className="text-start">
                  <p className="mb-0">Quotation No: <strong>NS3/2425/79</strong></p>
                  <p className="mb-0">Date: 1/10/2024</p>

                  <p className="mt-3 fw-bold">Bill To:</p>
                  <textarea
                    name="bill_to_description"

                    rows="3"
                    className="form-control"
                    value={formData.bill_to_description}
                    onChange={handleChange}
                    placeholder="Enter company deceription for bill"
                  />

                </div>
              </div>
            </div>

            {/* Form Section */}

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Decription</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Unit Price</th>
                  <th scope="col">Amount</th>
                  <th scope="col" className='text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <textarea
                      name="description"
                      rows="3"
                      className="form-control"
                      style={{ height: '38px' }}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter description"
                    />
                  </td>
                  <td>
                    <input
                      name="quantity"
                      type="number"
                      className={`form-control`}
                      value={formData.quantity}
                      onChange={handleChange}
                      style={{ height: '38px' }}
                    />
                  </td>
                  <td>
                    <input
                      name="unit_price"
                      type="number"
                      className={`form-control`}
                      value={formData.unit_price}
                      onChange={handleChange}
                      style={{ height: '38px' }}
                    />
                  </td>
                  <td>
                    <input
                      name="amount"
                      type="number"
                      className="form-control"
                      value={amount}
                      disabled
                      style={{ height: '38px' }}
                    />
                  </td>
                  <td>
                    <div className="d-flex">
                      <Button icon="pi pi-plus" className="p-button-sm p-button-text add-button"  />
                      <Button icon="pi pi-trash" className="delete-button p-button-sm p-button-danger p-button-text" />
                    </div>
                  </td>
                </tr>
              </tbody>

            </table>

            <div className="mt-3 ">
              <div className="d-flex justify-content-between p-3 border border-top border-dashed">
                <div className="col-md-6">
                  <p className='fs-6 '> <span className="fw-bold">Note : </span>
                    For any query related to gst email us at sales@ns3techsolutions.com
                    Or call us at 917009319674.
                  </p>
                </div>
                <div className="col-md-6 text-end">

                  <div className="d-flex justify-content-between px-2 border-bottom">
                    <div className="subtotal">
                      <p className="fs-6 fw-bold">Subtotal</p>
                    </div>
                    <div className="totalamount">
                      <p className='fs-6 fw-bold'>{amount.toFixed(2)}</p>
                    </div>
                  </div>


                  <div className="d-flex justify-content-between px-2 border-bottom">
                    <div className="subtotal">
                      <p className="fs-6 ">GST 18%</p>
                    </div>
                    <div className="totalamount">
                      <p className='fs-6'>{gst.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between px-2 text-center">
                    <div className="subtotal">
                      <p className="fs-6 ">Grand Total </p>
                    </div>
                    <div className="totalamount">
                      <p className='fs-6 fw-bold'>{grandTotal.toFixed(2)}</p>
                    </div>
                  </div>


                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className=" mt-4 pt-3 border border-dashed radius-full">
              <div className='p-2'>
                <p className="fw-bold">Terms & Conditions:</p>
                <ul className="small">
                  <li>Delivery Place: PAN India.</li>
                  <li>Payment Terms: 100% advance.</li>
                  <li>GST @18% extra as applicable.</li>
                  <li>Price validity is for 15 days.</li>
                  <li>Delivery Charges would be Extra.</li>
                  <li>Delivery: 1-2 Weeks, extendable against PO & receipt of the Payment.</li>
                  <li>
                    Order Cancellation or Any change in Bill of Material (BoM) part codes or quantity post BoM confirmation or
                    receipt of Purchase Order, we will charge 15% cancellation charges.
                  </li>
                </ul>
              </div>



            </div>

            <div className="border border-dashed mt-2 mb-2">
              <div className="p-2">
                <p className="fw-bold">Bank Account Details</p>
                <p className="mb-0 small">A/C Name: NS3Techsolutions Private Limited</p>
                <p className="mb-0 small">A/C No: 50200041286164 || IFSC: HDFC0001203</p>
              </div>

            </div>

          </div>

          <div className="d-flex gap-4 mt-3 mb-2">
            <i className="pi pi-save shadow scale" style={{ color: '#f77b55', fontSize: '1.5rem', cursor: 'pointer', }}></i>
            <i className="pi pi-download shadow" style={{ color: '#40baf3', fontSize: '1.5rem', cursor: 'pointer' }} onClick={handleDownloadPDF}></i>
            {/* <i className="pi pi-whatsapp shadow" style={{ color: 'green',fontSize:'1.5rem', cursor:'pointer' }}></i>
            <i className="pi pi-envelope shadow" style={{ color: '#e14d49',fontSize:'1.5rem', cursor:'pointer' }}></i> */}

            {/* <button className="btn-btn-sm bg-primary">Save</button> */}


          </div>


        </div>
      </div>
    </>
  );
};

export default QuatationForm;
