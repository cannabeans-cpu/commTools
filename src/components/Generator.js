import React, { useState } from 'react';
import './Generator.css';

const Generator = () => {
  const [developerAddress, setDeveloperAddress] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [customTokenAddress, setCustomTokenAddress] = useState('');
  const [iframeCode, setIframeCode] = useState('');

  const generateIframeCode = () => {
    const formattedIframeCode = `<iframe src="https://yourdomain.com/swap-widget?developerAddress=${developerAddress}&taxPercentage=${taxPercentage}&walletAddress=${walletAddress}&customTokenAddress=${customTokenAddress}" width="100%" height="500px" style="border:none;"></iframe>`;
    setIframeCode(formattedIframeCode);
  };

  return (
    <div className="generator-container">
      <div className="form-container">
        <h1>comTax Generator</h1>
        <div className="form-elements">
          <label htmlFor="developerAddress">Developer Address:</label>
          <input
            type="text"
            id="developerAddress"
            value={developerAddress}
            onChange={(e) => setDeveloperAddress(e.target.value)}
          />
          <label htmlFor="walletAddress">Wallet Address:</label>
          <input
            type="text"
            id="walletAddress"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <label htmlFor="taxPercentage">Tax Percentage:</label>
          <input
            type="number"
            id="taxPercentage"
            value={taxPercentage}
            onChange={(e) => setTaxPercentage(e.target.value)}
          />
          <label htmlFor="customTokenAddress">Custom Token Address:</label>
          <input
            type="text"
            id="customTokenAddress"
            value={customTokenAddress}
            onChange={(e) => setCustomTokenAddress(e.target.value)}
          />
          <button className="generate-button" onClick={generateIframeCode}>
            Generate
          </button>
        </div>
      </div>
      <div className="code-container">
        <pre>
          <code>{iframeCode}</code>
        </pre>
      </div>
    </div>
  );
};

export default Generator;
