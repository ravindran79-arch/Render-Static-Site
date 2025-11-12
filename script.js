document.getElementById('checkComplianceButton').addEventListener('click', async () => {
    const rfqInput = document.getElementById('rfqFile');
    const proposalInput = document.getElementById('proposalFile');
    const status = document.getElementById('status');
    const resultArea = document.getElementById('resultArea');
    const button = document.getElementById('checkComplianceButton');

    if (rfqInput.files.length === 0 || proposalInput.files.length === 0) {
        status.textContent = "Error: Please select both the RFQ and Proposal files.";
        return;
    }

    status.textContent = "Processing files and running AI comparison... This may take up to 30 seconds.";
    resultArea.textContent = "Loading...";
    button.disabled = true; 
    button.style.backgroundColor = '#6c757d';

    const formData = new FormData();
    formData.append('rfq', rfqInput.files[0]);
    formData.append('proposal', proposalInput.files[0]);

    const BACKEND_URL = "https://compliance-backend-fxxb.onrender.com/generate"; // ✅ Live backend URL

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            status.textContent = "Compliance check complete!";
            resultArea.innerHTML = marked.parse(data.text || "No result returned");
        } else {
            status.textContent = "Compliance Check Failed.";
            resultArea.textContent = `Error: ${data.error || "Unknown server error"}`;
            console.error("Backend Error:", data.error);
        }

    } catch (e) {
        status.textContent = "Error: Failed to connect to the backend server.";
        resultArea.textContent = "Network error. Check your backend URL and CORS settings.";
        console.error("Network Fetch Error:", e);
    } finally {
        button.disabled = false;
        button.style.backgroundColor = '#28a745';
    }
});
