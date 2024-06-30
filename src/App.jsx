import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Invoice from './components/Invoice/Invoice';
// import logo from './path/to/logo.png';
// import signature from './path/to/signature.png';

const fetchInvoiceData = async (invoiceId) => {
  const response = await axios.get(`https://your-invoice-ninja-instance/api/v1/invoices/${invoiceId}`, {
    headers: {
      'X-API-Token': 'your-api-token',
    },
  });
  return response.data;
};

const App = () => {
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    const loadInvoiceData = async () => {
      const data = await fetchInvoiceData('your-invoice-id');
      setInvoiceData(data);
    };

    loadInvoiceData();
  }, []);

  if (!invoiceData) {
    return <div>Loading...</div>;
  }

  // Map invoiceData to props for the Invoice component
  const sellerDetails = {
    name: invoiceData.seller_name,
    address: invoiceData.seller_address,
    city: invoiceData.seller_city,
    state: invoiceData.seller_state,
    pincode: invoiceData.seller_pincode,
    panNo: invoiceData.seller_pan_no,
    gstNo: invoiceData.seller_gst_no,
  };

  const placeOfSupply = invoiceData.place_of_supply;
  const billingDetails = {
    name: invoiceData.billing_name,
    address: invoiceData.billing_address,
    city: invoiceData.billing_city,
    state: invoiceData.billing_state,
    pincode: invoiceData.billing_pincode,
    stateCode: invoiceData.billing_state_code,
  };

  const shippingDetails = {
    name: invoiceData.shipping_name,
    address: invoiceData.shipping_address,
    city: invoiceData.shipping_city,
    state: invoiceData.shipping_state,
    pincode: invoiceData.shipping_pincode,
    stateCode: invoiceData.shipping_state_code,
  };

  const placeOfDelivery = invoiceData.place_of_delivery;
  const orderDetails = {
    orderNo: invoiceData.order_no,
    orderDate: invoiceData.order_date,
  };

  const invoiceDetails = {
    invoiceNo: invoiceData.invoice_no,
    invoiceDate: invoiceData.invoice_date,
  };

  const reverseCharge = invoiceData.reverse_charge;

  const items = invoiceData.items.map(item => ({
    description: item.description,
    unitPrice: item.unit_price,
    quantity: item.quantity,
    discount: item.discount,
    taxRate: item.tax_rate,
  }));

  return (
    <div className="App">
      <Invoice
        // logo={logo}
        sellerDetails={sellerDetails}
        placeOfSupply={placeOfSupply}
        billingDetails={billingDetails}
        shippingDetails={shippingDetails}
        placeOfDelivery={placeOfDelivery}
        orderDetails={orderDetails}
        invoiceDetails={invoiceDetails}
        reverseCharge={reverseCharge}
        items={items}
        // signature={signature}
      />
    </div>
  );
};

export default App;
