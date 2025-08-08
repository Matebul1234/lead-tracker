import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Toast } from 'primereact/toast';
import { Country, State, City } from 'country-state-city';
import { Dialog } from 'primereact/dialog';


const LeadForm = ({ onSuccess, leadData }) => {
  const useremail = localStorage.getItem('useremail');

  // console.log(useremail,"useremail in lead form")

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    customer: '',
    country: '',
    state: '',
    city: '',
    website_link: '',
    product: '',
    industry_type: '',
    lead_status: '',
    lead_owner: '',
    description: '',
  });

  const [phone, setPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
  const toast = useRef(null);

  // Customer meterials ==========================
  const [customersData, setCustomersData] = useState([]);
  const [openCustomer, setopenCustomer] = useState(false);

  const [customerformData, setCustomerformdata] = useState({
    customer: '',
    company_name: '',
    customer_website_link: ''
  });

  // form data take during the input user
  const handleChangeCustomerForm = (e) => {
    const { name, value } = e.target;
    setCustomerformdata(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // Submit Customer form data
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    console.log(customerformData)

    try {
      const response = await axios.post(`${API_URL}/api/customer/add-customer`, customerformData);
      console.log("API response:", response.data);

      if (response.data.message === 'Customer added successfully') {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Customer added successfully!',
          life: 3000,
        });

        // Reset form
        setCustomerformdata({
          customer: '',
          company_name: '',
          customer_website_link: ''
        });
        getAllCustomers();

        setopenCustomer(false);
      } else {
        // Handle unexpected failure
        toast.current?.show({
          severity: 'warn',
          summary: 'Warning',
          detail: response.data.message || 'Customer could not be added.',
          life: 3000,
        });
      }

    } catch (error) {
      console.error("Error adding customer:", error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.response?.data?.message || 'Something went wrong!',
        life: 3000,
      });
    }
  };


  const getAllCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/customer/get-all-customer`);
      setCustomersData(response.data.rows);
      // console.log(response.data.rows,"customers data",);

    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.response, life: 3000 });
    }
  }

  // get all customers data on page load
  useEffect(() => { getAllCustomers(); }, []);


  // customer ============================


  // Load countries on mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (formData.country) {
      const allCountries = Country.getAllCountries();
      const selectedCountry = allCountries.find(c => c.name === formData.country);
      if (selectedCountry) {
        setStates(State.getStatesOfCountry(selectedCountry.isoCode));
        setFormData(prev => ({ ...prev, state: '', city: '' }));
        setCities([]); // reset cities
      }
    } else {
      setStates([]);
      setCities([]);
    }
  }, [formData.country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (formData.state && formData.country) {
      const allCountries = Country.getAllCountries();
      const selectedCountry = allCountries.find(c => c.name === formData.country);
      if (selectedCountry) {
        const allStates = State.getStatesOfCountry(selectedCountry.isoCode);
        const selectedState = allStates.find(s => s.name === formData.state);
        if (selectedState) {
          setCities(City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode));
          setFormData(prev => ({ ...prev, city: '' }));
        }
      }
    } else {
      setCities([]);
    }
  }, [formData.state, formData.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is Required';
    if (!formData.industry_type.trim()) newErrors.industry_type = 'Industry Type is Required';
    if (!formData.customer.trim()) newErrors.customer = 'Customer is Required';
    if (!phone) newErrors.phone = 'Phone Number is Required';
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
        ...formData,
        phone,
        date: selectedDate,
        useremail,
      };
      // console.log(leadData, "leadData in handleSubmit functions");
      if (leadData) {
        // update existing lead /update-lead/:id
        await axios.put(`${API_URL}/api/lead/update-lead/${leadData.id}`, payload);
        // onSuccess();
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Lead updated successfully!',
          life: 1000,
        });
        
      } else {
        // add new lead
        await axios.post(`${API_URL}/api/lead/add-lead`, payload);
        // onSuccess();
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Lead created successfully!',
          life: 1000,
        });
       
      }

      // clear form

      setTimeout(()=>{
      setFormData({
        name: '',
        email: '',
        customer: '',
        country: '',
        state: '',
        city: '',
        website_link: '',
        product: '',
        industry_type: '',
        lead_status: '',
        lead_owner: '',
        description: '',
      });
      setPhone('');
      setSelectedDate(new Date());
      setErrors({});
      onSuccess && onSuccess();
      },1000);

    } catch (error) {
      console.error('Error:', error);
      const message = error.response?.data?.message || 'Something went wrong';
      const status = error.response?.status;
      if (status === 409) {
        toast.current?.show({ severity: 'warn', summary: 'Duplicate Lead', detail: message, life: 3000 });
      } else if (status === 400) {
        toast.current?.show({ severity: 'warn', summary: 'Validation Error', detail: message, life: 3000 });
      } else {
        toast.current?.show({ severity: 'error', summary: 'Server Error', detail: message, life: 3000 });
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  // for patching data when user wants to edit leads
  // Patch formData when editing / adding new lead
  useEffect(() => {
    if (leadData) {
      // console.log(leadData, "leadData in useEffect");
      setFormData({
        name: leadData.name || '',
        email: leadData.email || '',
        customer: leadData.customer || '',
        country: leadData.country || '',
        state: leadData.state || '',
        city: leadData.city || '',
        website_link: leadData.website_link || '',
        product: leadData.product || '',
        industry_type: leadData.industry_type || '',
        lead_status: leadData.lead_status || '',
        lead_owner: leadData.lead_owner || '',
        description: leadData.description || '',
      });
      setPhone(leadData.phone || '');
      setSelectedDate(leadData.Date ? new Date(leadData.Date) : new Date());
    } else {
      // clear form when adding new lead
      setFormData({
        name: '',
        email: '',
        customer: '',
        country: '',
        state: '',
        city: '',
        website_link: '',
        product: '',
        industry_type: '',
        lead_status: '',
        lead_owner: '',
        description: '',
      });
      setPhone('');
      setSelectedDate(new Date());
      setStates([]);
      setCities([]);
    }
  }, [leadData]);

  // fetch data in refresh

  // for state patch
  // Load states when country changes
  useEffect(() => {
    if (formData.country) {
      const allCountries = Country.getAllCountries();
      const selectedCountry = allCountries.find(c => c.name === formData.country);
      if (selectedCountry) {
        const foundStates = State.getStatesOfCountry(selectedCountry.isoCode);
        setStates(foundStates);
      } else {
        setStates([]);
      }
    } else {
      setStates([]);
    }
    setCities([]); // reset cities when country changes
  }, [formData.country]);
  // and this for city patch
  // Load cities when state changes
  useEffect(() => {
    if (formData.country && formData.state) {
      const allCountries = Country.getAllCountries();
      const selectedCountry = allCountries.find(c => c.name === formData.country);
      if (selectedCountry) {
        const foundStates = State.getStatesOfCountry(selectedCountry.isoCode);
        const selectedState = foundStates.find(s => s.name === formData.state);
        if (selectedState) {
          const foundCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
          setCities(foundCities);
        } else {
          setCities([]);
        }
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [formData.state, formData.country]);



  return (
    <>
      <Toast ref={toast} />
      <div className="d-flex justify-content-center align-items-center">
        <div className="card px-4 w-100 shadow" style={{ maxWidth: '800px' }}>
          <form onSubmit={handleSubmit}>
            {/* Name & Email */}
            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label fw-bold ">Full Name*</label>
                <input
                  name="name"
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-bold">Email</label>
                <input
                  name="email"
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />

              </div>
            </div>

            {/* Phone & Customer */}
            <div className="row mb-3">
              <div className="col-md-6 mb-2">
                <label className="form-label fw-bold">Phone Number*</label>
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={phone}
                  onChange={setPhone}
                  className={`form-control border-none ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
              </div>
              {/* <div className="col-md-6 mb-2">
                <label className="form-label fw-bold">Customer*</label>
                <input
                  name="customer"
                  type="text"
                  className="form-control"
                  value={formData.customer}
                  onChange={handleChange}
                  placeholder="Enter Customer name"
                />
              </div>
               {errors.customer && <div className="invalid-feedback">{errors.customer}</div>} */}
              <div className="col-md-6 mb-2">
                <label className="form-label fw-bold">Customer*</label>

                {/* <select
                  name="customer"
                  className="form-control"
                  value={formData.customer || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "__add_new__") {
                      setopenCustomer(true);
                      return;
                    }
                    handleChange(e);
                  }}
                >
                  {customersData?.map((customer) => (
                    <option value={customer.customer} key={customer.id} >{customer.customer}</option>
                  ))}

                  <option value="__add_new__">➕ Add New</option>
                </select> */}


                <select
                  name="customer"
                  className="form-control"
                  value={formData.customer || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "__add_new__") {
                      setopenCustomer(true);
                      return;
                    }
                    handleChange(e);
                  }}
                >
                  <option value="">-- Select Customer --</option>

                  {customersData && customersData.length > 0 && (
                    customersData.map((customer) => (
                      <option value={customer.customer} key={customer.id}>
                        {customer.customer}
                      </option>
                    ))
                  )}

                  <option value="__add_new__">➕ Add New</option>
                </select>





              </div>


            </div>

            {/* Country, State, City */}
            <div className="row mb-3">
              <div className="col-md-4 mb-2">
                <label className="form-label fw-bold">Country</label>
                <select
                  name="country"
                  className="form-control"
                  value={formData.country}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, country: e.target.value }));
                  }}
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c.isoCode} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-2">
                <label className="form-label fw-bold">State</label>
                <select
                  name="state"
                  className="form-control"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  disabled={!states.length}
                >
                  <option value="">Select state</option>
                  {states.map((s) => (
                    <option key={s.isoCode} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-2">
                <label className="form-label fw-bold">City</label>
                <select
                  name="city"
                  className="form-control"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  disabled={!cities.length}
                >
                  <option value="">Select city</option>
                  {cities.map((city, idx) => (
                    <option key={idx} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Website Link */}
            <div className="row mb-3">
              {/* <label className="form-label fw-bold">Website Link</label>
              <input
                name="website_link"
                type="text"
                className="form-control"
                value={formData.website_link}
                onChange={handleChange}
                placeholder="Enter website link"
              /> */}




              <div className="col-md-6 mb-2">
                <label className="form-label fw-bold">Website Link</label>
                <input
                  name="website_link"
                  type="text"
                  className="form-control"
                  value={formData.website_link || ''}
                  onChange={handleChange}
                  placeholder="Enter website link"
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-bold">Product</label>
                <input
                  name="product"
                  type="text"
                  className="form-control"
                  value={formData.product || ''}
                  onChange={handleChange}
                  placeholder="Enter product.."
                />
              </div>

            </div>
            {/* Industry Type & Lead Status */}
            <div className="row mb-3">
              <div className="col-md-6 mb-2">
                <label className="form-label fw-bold">Industry Type*</label>
                <select
                  name="industry_type"
                  className="form-control"
                  value={formData.industry_type}
                  onChange={handleChange}
                >
                  <option value="">Select industry</option>
                  <option value="IT & Technology">IT & Technology</option>
                  <option value="Education / EdTech">Education / EdTech</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Retail / E-commerce">Retail / E-commerce</option>
                  <option value="Banking & Financial Services">Banking & Financial Services</option>
                  <option value="Real Estate ">Real Estate </option>
                  <option value="Hospitality & Travel">Hospitality & Travel</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Government / Public Sector">Government / Public Sector</option>
                  <option value="Media & Entertainment">Media & Entertainment</option>
                </select>
                {errors.industry_type && <div className="invalid-feedback d-block">{errors.industry_type}</div>}
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-bold">Lead Status</label>
                <select
                  name="lead_status"
                  className="form-control"
                  value={formData.lead_status}
                  onChange={handleChange}
                >
                  <option value="">Select lead status</option>
                  <option value="Follow up">Follow up</option>
                  <option value="DNP- Did not pick">DNP- Did not pick</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Payment Follow up">Payment Follow up</option>
                  <option value="Won/Lost">Won/Lost</option>
                </select>
              </div>
            </div>

            {/* Lead Owner & Date */}
            <div className="row mb-3">
              <div className="col-md-6 mb-2">
                <label className="form-label fw-bold">Lead Owner</label>
                <input
                  name="lead_owner"
                  type="text"
                  className="form-control"
                  value={formData.lead_owner}
                  onChange={handleChange}
                  placeholder="Enter lead owner"
                />
              </div>
              <div className="col-md-6 mb-2">
                <div className="d-flex flex-column">
                  <label className="form-label fw-bold">Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    placeholderText='dd-MM-yyyy'
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                name="description"
                rows="3"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </div>

            <div className="mb-3">
              <button type="submit" disabled={isSubmitting} className={`btn w-100 ${isSubmitting ? 'btn-secondary' : 'btn-primary'}, ${leadData ? 'btn-warning' : 'btn-primary'}`}>
                {isSubmitting ? 'Submitting...' : (leadData ? 'Update Lead' : 'Create Lead')}

              </button>
            </div>
          </form>
        </div>
      </div>

      <Dialog
        header="Add Customer"
        visible={openCustomer}
        maximizable
        style={{ width: window.innerWidth < 768 ? '95vw' : '30vw' }}
        onHide={() => setopenCustomer(false)}
      >
        <div className="card px-4 w-100 shadow" style={{ maxWidth: '800px' }}>
          <form onSubmit={handleCustomerSubmit}>
            <div className="mb-2">
              <label className="form-label fw-bold">Company Name</label>
              <input
                name="company_name"
                type="text"
                className="form-control"
                value={customerformData.company_name || ''}
                onChange={handleChangeCustomerForm}
                placeholder="Enter company name"
              />
            </div>

            <div className="mb-2">
              <label className="form-label fw-bold">Customer Name*</label>
              <input
                name="customer"
                type="text"
                className="form-control"
                value={customerformData.customer || ''}
                onChange={handleChangeCustomerForm}
                placeholder="Enter customer name"
              />
            </div>

            <div className="mb-2">
              <label className="form-label fw-bold">Customer Website Link</label>
              <input
                name="customer_website_link"
                type="text"
                className="form-control"
                value={customerformData.customer_website_link || ''}
                onChange={handleChangeCustomerForm}
                placeholder="Enter website link"
              />
            </div>

            <div className="mt-2 mb-2 text-center">
              {/* <button
                type="submit"
                disabled={isSubmitting}
                className={`btn w-50 ${isSubmitting ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button> */}

              <button
                type="submit"

                className={`btn w-50 btn-primary`}
              >
                submit
              </button>

            </div>
          </form>
        </div>
      </Dialog>

    </>
  );
};

export default LeadForm;
