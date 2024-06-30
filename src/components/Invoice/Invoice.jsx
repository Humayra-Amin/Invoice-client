import React from 'react';

const Invoice = ({
  logo,
  sellerDetails,
  placeOfSupply,
  billingDetails,
  shippingDetails,
  placeOfDelivery,
  orderDetails,
  invoiceDetails,
  reverseCharge,
  items,
  signature,
}) => {
  // Utility functions to calculate derived values
  const calculateNetAmount = (unitPrice, quantity, discount) => {
    return unitPrice * quantity - discount;
  };

  const calculateTaxAmount = (netAmount, taxRate) => {
    return netAmount * (taxRate / 100);
  };

  const calculateTotalAmount = (netAmount, taxAmount) => {
    return netAmount + taxAmount;
  };

  const getTaxType = (placeOfSupply, placeOfDelivery) => {
    return placeOfSupply === placeOfDelivery ? 'CGST/SGST' : 'IGST';
  };

  const formatAmountInWords = (amount) => {
    // Implement a utility function to convert amount to words
    return amount;
  };

  return (
    <div className="p-8 bg-white border border-gray-300 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <img src={logo} alt="Company Logo" className="h-20" />
        <div>
          <p><strong>{sellerDetails.name}</strong></p>
          <p>{sellerDetails.address}</p>
          <p>{`${sellerDetails.city}, ${sellerDetails.state}, ${sellerDetails.pincode}`}</p>
          <p>PAN: {sellerDetails.panNo}</p>
          <p>GST Registration No: {sellerDetails.gstNo}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold">Billing Details</h2>
          <p><strong>{billingDetails.name}</strong></p>
          <p>{billingDetails.address}</p>
          <p>{`${billingDetails.city}, ${billingDetails.state}, ${billingDetails.pincode}`}</p>
          <p>State/UT Code: {billingDetails.stateCode}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Shipping Details</h2>
          <p><strong>{shippingDetails.name}</strong></p>
          <p>{shippingDetails.address}</p>
          <p>{`${shippingDetails.city}, ${shippingDetails.state}, ${shippingDetails.pincode}`}</p>
          <p>State/UT Code: {shippingDetails.stateCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p>Place of Supply: {placeOfSupply}</p>
          <p>Place of Delivery: {placeOfDelivery}</p>
        </div>
        <div>
          <p>Order No: {orderDetails.orderNo}</p>
          <p>Order Date: {orderDetails.orderDate}</p>
          <p>Invoice No: {invoiceDetails.invoiceNo}</p>
          <p>Invoice Date: {invoiceDetails.invoiceDate}</p>
          <p>Reverse Charge: {reverseCharge ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <table className="w-full text-left mb-4">
        <thead>
          <tr>
            <th>Description</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Discount</th>
            <th>Net Amount</th>
            <th>Tax Type</th>
            <th>Tax Rate</th>
            <th>Tax Amount</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const netAmount = calculateNetAmount(item.unitPrice, item.quantity, item.discount);
            const taxType = getTaxType(placeOfSupply, placeOfDelivery);
            const taxAmount = calculateTaxAmount(netAmount, item.taxRate);
            const totalAmount = calculateTotalAmount(netAmount, taxAmount);

            return (
              <tr key={index}>
                <td>{item.description}</td>
                <td>{item.unitPrice}</td>
                <td>{item.quantity}</td>
                <td>{item.discount}</td>
                <td>{netAmount}</td>
                <td>{taxType}</td>
                <td>{item.taxRate}%</td>
                <td>{taxAmount}</td>
                <td>{totalAmount}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="8" className="text-right">Total</td>
            <td>{items.reduce((acc, item) => acc + calculateTotalAmount(calculateNetAmount(item.unitPrice, item.quantity, item.discount), calculateTaxAmount(calculateNetAmount(item.unitPrice, item.quantity, item.discount), item.taxRate)), 0)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="mb-4">
        <p>Amount in words: {formatAmountInWords(items.reduce((acc, item) => acc + calculateTotalAmount(calculateNetAmount(item.unitPrice, item.quantity, item.discount), calculateTaxAmount(calculateNetAmount(item.unitPrice, item.quantity, item.discount), item.taxRate)), 0))}</p>
      </div>

      <div className="flex justify-end">
        <div className="text-center">
          <p>For {sellerDetails.name}:</p>
          <img src={signature} alt="Signature" className="h-20" />
          <p>Authorised Signatory</p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
