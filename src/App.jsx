import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState({
    logo: '',
    sellerDetails: {
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      panNo: '',
      gstNo: '',
    },
    placeOfSupply: '',
    billingDetails: {
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      stateCode: '',
    },
    shippingDetails: {
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      stateCode: '',
    },
    placeOfDelivery: '',
    orderDetails: {
      orderNo: '',
      orderDate: '',
    },
    invoiceDetails: {
      invoiceNo: '',
      invoiceDate: '',
    },
    reverseCharge: 'No',
    items: [],
    signature: '',
  });
  const [item, setItem] = useState({
    description: '',
    unitPrice: 0,
    quantity: 0,
    discount: 0,
    taxRate: 18,
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    if (keys.length > 1) {
      setInvoice((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setInvoice({ ...invoice, [name]: value });
    }
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleAddItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));
    setItem({
      description: '',
      unitPrice: 0,
      quantity: 0,
      discount: 0,
      taxRate: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newInvoice = { ...invoice };

    newInvoice.items = newInvoice.items.map((item) => {
      const netAmount = item.unitPrice * item.quantity - item.discount;
      const taxAmount = netAmount * (item.taxRate / 100);
      const totalAmount = netAmount + taxAmount;
      return {
        ...item,
        netAmount,
        taxType: invoice.placeOfSupply === invoice.placeOfDelivery ? `CGST & SGST (9% each)` : `IGST (${item.taxRate}%)`,
        taxAmount,
        totalAmount,
      };
    });

    console.log('New Invoice:', newInvoice);

    try {
      const response = await axios.post('http://localhost:5000/api/invoices', newInvoice);
      setInvoices([...invoices, response.data]);
      setInvoice({
        logo: '',
        sellerDetails: {
          name: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          panNo: '',
          gstNo: '',
        },
        placeOfSupply: '',
        billingDetails: {
          name: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          stateCode: '',
        },
        shippingDetails: {
          name: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          stateCode: '',
        },
        placeOfDelivery: '',
        orderDetails: {
          orderNo: '',
          orderDate: '',
        },
        invoiceDetails: {
          invoiceNo: '',
          invoiceDate: '',
        },
        reverseCharge: 'No',
        items: [],
        signature: '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const downloadPdf = async (invoiceId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/invoices/${invoiceId}/pdf`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Invoice</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Logo */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Company Logo URL</label>
            <input
              type="text"
              name="logo"
              value={invoice.logo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Logo URL"
              required
            />
          </div>

          {/* Seller Details */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Seller Details</h2>
            {['name', 'address', 'city', 'state', 'pincode', 'panNo', 'gstNo'].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-2 capitalize">{field.replace('No', ' Number')}</label>
                <input
                  type="text"
                  name={`sellerDetails.${field}`}
                  value={invoice.sellerDetails[field]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={field.replace('No', ' Number')}
                  required
                />
              </div>
            ))}
          </div>

          {/* Place of Supply */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Place of Supply</label>
            <input
              type="text"
              name="placeOfSupply"
              value={invoice.placeOfSupply}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Place of Supply"
              required
            />
          </div>

          {/* Billing Details */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Billing Details</h2>
            {['name', 'address', 'city', 'state', 'pincode', 'stateCode'].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-2 capitalize">{field.replace('Code', ' Code')}</label>
                <input
                  type="text"
                  name={`billingDetails.${field}`}
                  value={invoice.billingDetails[field]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={field.replace('Code', ' Code')}
                  required
                />
              </div>
            ))}
          </div>

          {/* Shipping Details */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Shipping Details</h2>
            {['name', 'address', 'city', 'state', 'pincode', 'stateCode'].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-2 capitalize">{field.replace('Code', ' Code')}</label>
                <input
                  type="text"
                  name={`shippingDetails.${field}`}
                  value={invoice.shippingDetails[field]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={field.replace('Code', ' Code')}
                  required
                />
              </div>
            ))}
          </div>

          {/* Place of Delivery */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Place of Delivery</label>
            <input
              type="text"
              name="placeOfDelivery"
              value={invoice.placeOfDelivery}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Place of Delivery"
              required
            />
          </div>

          {/* Order Details */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Order Details</h2>
            {['orderNo', 'orderDate'].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-2 capitalize">{field.replace('No', ' Number')}</label>
                <input
                  type="text"
                  name={`orderDetails.${field}`}
                  value={invoice.orderDetails[field]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={field.replace('No', ' Number')}
                  required
                />
              </div>
            ))}
          </div>

          {/* Invoice Details */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Invoice Details</h2>
            {['invoiceNo', 'invoiceDate'].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-2 capitalize">{field.replace('No', ' Number')}</label>
                <input
                  type="text"
                  name={`invoiceDetails.${field}`}
                  value={invoice.invoiceDetails[field]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={field.replace('No', ' Number')}
                  required
                />
              </div>
            ))}
          </div>

          {/* Reverse Charge */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Reverse Charge</label>
            <select
              name="reverseCharge"
              value={invoice.reverseCharge}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Items */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Items</h2>
            {['description', 'unitPrice', 'quantity', 'discount', 'taxRate'].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-2 capitalize">{field.replace('Rate', ' Rate')}</label>
                <input
                  type="text"
                  name={field}
                  value={item[field]}
                  onChange={handleItemChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={field.replace('Rate', ' Rate')}
                />
              </div>
            ))}
          </div>

          {/* Signature */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Signature URL</label>
            <input
              type="text"
              name="signature"
              value={invoice.signature}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Signature URL"
            />
          </div>

          <button type="submit"
            className="w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
            Create Invoice
          </button>
        </form>
      </div>

      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md mt-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Invoice List</h1>
        {loading ? (
          <p>Loading invoices...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Invoice No</th>
                  <th className="px-4 py-2">Invoice Date</th>
                  <th className="px-4 py-2">Order No</th>
                  <th className="px-4 py-2">Order Date</th>
                  <th className="px-4 py-2">Total Amount</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td className="border px-4 py-2">{invoice.invoiceDetails.invoiceNo}</td>
                    <td className="border px-4 py-2">{invoice.invoiceDetails.invoiceDate}</td>
                    <td className="border px-4 py-2">{invoice.orderDetails.orderNo}</td>
                    <td className="border px-4 py-2">{invoice.orderDetails.orderDate}</td>
                    <td className="border px-4 py-2">{invoice.items.reduce((total, item) => total + item.totalAmount, 0)}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => downloadPdf(invoice._id)}
                        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
