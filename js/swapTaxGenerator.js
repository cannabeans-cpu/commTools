document.getElementById("swapTaxForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const communityWalletAddress = document.getElementById("communityWalletAddress").value;
    const taxPercentage = document.getElementById("taxPercentage").value;
    const customTokenAddress = document.getElementById("customTokenAddress").value;

    const iframeCode = `<iframe src="https://your-domain.com/swapTaxWidget.html?communityWalletAddress=${communityWalletAddress}&taxPercentage=${taxPercentage}&customTokenAddress=${customTokenAddress}" width="500" height="500"></iframe>`;
    document.getElementById("generatedCode").value = iframeCode;
});
