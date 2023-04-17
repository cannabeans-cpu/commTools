import React, { useState } from 'react';
import './Generator.css';

const Generator = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [tokenAddress, setTokenAddress] = useState('');
  const [iframeCode, setIframeCode] = useState('');

  const generateCode = () => {
    const code = `<iframe src="https://master--fastidious-gingersnap-9c813d.netlify.app?walletAddress=${walletAddress}&taxPercentage=${taxPercentage}&tokenAddress=${tokenAddress}" width="100%" height="300" frameborder="0" scrolling="no"></iframe>`;
    setIframeCode(code);
  };

  return (
    <div>
      <div className="glass form-elements">
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
          min="0"
          step="0.01"
          value={taxPercentage}
          onChange={(e) => setTaxPercentage(parseFloat(e.target.value))}
        />
        <label htmlFor="tokenAddress">Custom Token Address:</label>
        <input
          type="text"
          id="tokenAddress"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
        <button onClick={generateCode}>Generate</button>
      </div>
      <div className="glass code-container">
        {iframeCode && (
          <div>
            <h3>Generated Code:</h3>
            <pre>{iframeCode}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;

