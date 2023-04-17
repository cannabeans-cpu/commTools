import React, { useState } from 'react';
import './SwapWidget.css';
import { ChainId, Token, WETH, Fetcher, Route, Trade, TokenAmount, TradeType, Percent } from '@uniswap/sdk';
import { ethers } from 'ethers';

const SwapWidget = ({ walletAddress, taxPercentage, customTokenAddress }) => {
  const [inputTokenAmount, setInputTokenAmount] = useState('');
  const [outputTokenAmount, setOutputTokenAmount] = useState('');
  const [executionPrice, setExecutionPrice] = useState('');
  const [invertedExecutionPrice, setInvertedExecutionPrice] = useState('');
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);

  const handleConnect = async () => {
      const handleConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        const _signer = _provider.getSigner();
        setProvider(_provider);
        setSigner(_signer);
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this application.');
    }
  };

  };

  const calculateOutputAmount = async () => {
      const calculateOutputAmount = async (inputAmount) => {
    if (!provider || !signer || !account) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!inputAmount || inputAmount <= 0) {
      alert('Please enter a valid input amount.');
      return;
    }

    try {
      const amountIn = CurrencyAmount.fromRawAmount(inputToken, JSBI.BigInt(inputAmount));
      const trade = await Trade.bestTradeExactIn([pair], amountIn, outputToken);
      if (trade[0]) {
        const outputAmount = trade[0].outputAmount.toFixed();
        setOutputAmount(outputAmount);
      } else {
        alert('Unable to calculate output amount. Please try again.');
      }
    } catch (error) {
      console.error('Error calculating output amount:', error);
      alert('Error calculating output amount. Please try again.');
    }
  };

  };

  const executeSwap = async () => {
      const executeSwap = async () => {
    if (!provider || !signer || !account) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!inputAmount || inputAmount <= 0 || !outputAmount || outputAmount <= 0) {
      alert('Please enter a valid input amount and calculate the output amount.');
      return;
    }

    try {
      // Execute the swap
      const amountIn = CurrencyAmount.fromRawAmount(inputToken, JSBI.BigInt(inputAmount));
      const trade = await Trade.bestTradeExactIn([pair], amountIn, outputToken);
      if (trade[0]) {
        const slippageTolerance = new Percent(50, 10_000); // 0.5% slippage tolerance
        const { route, outputAmount } = trade[0];
        const to = account;
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
        const swapParams = SwapParameters.supportedInterface(route, amountIn, outputAmount, slippageTolerance, to, deadline);
        const tx = await SwapHelpers.executeSwap(signer, swapParams, route);

        // Calculate taxes
        const taxAmountDeveloper = JSBI.divide(JSBI.multiply(inputAmount, JSBI.BigInt(developerTaxPercentage)), JSBI.BigInt(100));
        const taxAmountCommunity = JSBI.divide(JSBI.multiply(inputAmount, JSBI.BigInt(communityTaxPercentage)), JSBI.BigInt(100));

        // Send taxes to wallet addresses
        const taxTxDeveloper = await SwapHelpers.sendTax(signer, developerAddress, inputToken, taxAmountDeveloper);
        const taxTxCommunity = await SwapHelpers.sendTax(signer, communityAddress, inputToken, taxAmountCommunity);

        // Wait for transactions to be confirmed
        await Promise.all([tx.wait(), taxTxDeveloper.wait(), taxTxCommunity.wait()]);
        alert('Swap executed and taxes sent successfully!');
      } else {
        alert('Unable to execute swap. Please try again.');
      }
    } catch (error) {
      console.error('Error executing swap:', error);
      alert('Error executing swap. Please try again.');
    }
  };

  };
};

export default SwapWidget;
