import { Token, Fetcher, Trade, Route, TokenAmount, Percent } from "@uniswap/sdk-core";
import { ChainId } from "@uniswap/v2-sdk";
import { ethers } from "ethers";

const yourWalletAddress = '0xAbE56E1321960fEac806c1C217ab8CB3a46136f0';

let userSigner;
let userWalletAddress;

document.getElementById("connectWallet").addEventListener("click", async function () {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            userSigner = provider.getSigner();
            userWalletAddress = await userSigner.getAddress();
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    } else {
        alert("Please install MetaMask or another Ethereum wallet provider.");
    }
});

document.getElementById("swapToken").addEventListener("click", async function () {
    const selectedTokenAddress = document.getElementById("inputToken").value;
    const amountToSwap = document.getElementById("amountToSwap").value;

    // Fetch input and output tokens from the Uniswap SDK
    const inputToken = await Fetcher.fetchTokenData(ChainId.MAINNET, selectedTokenAddress);
    const outputToken = await Fetcher.fetchTokenData(ChainId.MAINNET, customTokenAddress);

    // Create a Uniswap trade
    const pair = await Fetcher.fetchPairData(inputToken, outputToken);
    const route = new Route([pair], inputToken);
    const trade = new Trade(route, new TokenAmount(inputToken, amountIn), TradeType.EXACT_INPUT);

    // Calculate the amount out, slippage, and deadline
    const amountOutMin = trade.minimumAmountOut(new Percent("1", "100")).raw;
    const slippageTolerance = new Percent("50", "10000"); // 0.50% slippage tolerance
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current time

    const communityWalletAddress = new URLSearchParams(window.location.search).get("communityWalletAddress");
    const taxPercentage = parseFloat(new URLSearchParams(window.location.search).get("taxPercentage"));
    const customTokenAddress = new URLSearchParams(window.location.search).get("customTokenAddress");

    // Instantiate the Uniswap V2 Router contract
    const uniswapV2Router = new ethers.Contract(uniswapV2RouterAddress, UniswapV2Router02ABI, userSigner);

    // Approve the input token transfer
    const tokenContract = new ethers.Contract(selectedTokenAddress, erc20Abi, userSigner);
    const amountIn = ethers.utils.parseUnits(amountToSwap, inputToken.decimals);
    const approveTx = await tokenContract.approve(uniswapV2RouterAddress, amountIn);
    await approveTx.wait();

    // Calculate taxes for the community wallet and your wallet
    const totalTaxPercentage = taxPercentage + 1;
    const totalTaxAmount = amountIn.mul(totalTaxPercentage).div(100);
    const yourTaxAmount = amountIn.mul(1).div(100);
    const communityTaxAmount = totalTaxAmount.sub(yourTaxAmount);

    // Perform the token swap and send taxes
    const path = [selectedTokenAddress, customTokenAddress];
    const amountOutMinWithTotalTax = amountOutMin.sub(totalTaxAmount);
    const swapTx = await uniswapV2Router.swapExactTokensForTokens(
        amountIn,
        amountOutMinWithTotalTax,
        path,
        userWalletAddress,
        deadline
    );
    await swapTx.wait();

    // Transfer the taxes to the community wallet and your wallet
    const transferToCommunityTx = await tokenContract.transfer(communityWalletAddress, communityTaxAmount);
    await transferToCommunityTx.wait();

    const transferToYourWalletTx = await tokenContract.transfer(yourWalletAddress, yourTaxAmount);
    await transferToYourWalletTx.wait();
});
