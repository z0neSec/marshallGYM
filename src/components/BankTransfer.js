import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/BankTransfer.css';
import { toastSuccess, toastError } from '../utils/toast';

const BankTransfer = ({ orderId, onSuccess }) => {
  const [bankDetails, setBankDetails] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/orders/bank/details')
      .then(res => setBankDetails(res.data))
      .catch(err => {
        console.error(err);
        toastError('Could not load bank details');
      });
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/orders/${orderId}/confirm-payment`);
      if (res.data && res.data.ok) {
        toastSuccess('Payment confirmed! Thank you for your order.');
        if (onSuccess) onSuccess(res.data.order);
      } else {
        toastError('Could not confirm payment');
      }
    } catch (err) {
      console.error(err);
      toastError('Confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!bankDetails) return <div className="bt-loading">Loading bank details...</div>;

  return (
    <div className="bank-transfer">
      <div className="bt-header">
        <h3>Bank Transfer Payment</h3>
        <p>Please transfer the amount below to our bank account</p>
      </div>

      <div className="bt-details-card">
        <div className="bt-detail-row">
          <span className="label">Bank Name</span>
          <span className="value">{bankDetails.bankName}</span>
          <button className="copy-btn" onClick={() => copyToClipboard(bankDetails.bankName)}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        <div className="bt-detail-row">
          <span className="label">Account Name</span>
          <span className="value">{bankDetails.accountName}</span>
          <button className="copy-btn" onClick={() => copyToClipboard(bankDetails.accountName)}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        <div className="bt-detail-row">
          <span className="label">Account Number</span>
          <span className="value">{bankDetails.accountNumber}</span>
          <button className="copy-btn" onClick={() => copyToClipboard(bankDetails.accountNumber)}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

      </div>

      <div className="bt-instructions">
        <h4>Instructions</h4>
        <ol>
          <li>Copy the bank account details above</li>
          <li>Log into your bank account</li>
          <li>Initiate a fund transfer using the details provided</li>
          <li>Once payment is confirmed, click the button below</li>
        </ol>
      </div>

      <button className="bt-confirm-btn" onClick={handleConfirmPayment} disabled={loading}>
        {loading ? 'Confirming...' : 'I Have Made The Transfer'}
      </button>

      <p className="bt-note">
        Your order will be processed once we receive your payment. You will receive a confirmation email/call shortly.
      </p>
    </div>
  );
};

export default BankTransfer;
