document.addEventListener('DOMContentLoaded', () => {
    const rfqInput = document.getElementById('rfqFile');
    const proposalInput = document.getElementById('proposalFile');
    const status = document.getElementById('status');
    const resultArea = document.getElementById('resultArea');
    const button = document.getElementById('checkComplianceButton');

    button.addEventListener('click', async () => {
        // Check for file selection
        if (!rfqInput.files.length || !proposalInput.files.length) {
            status.textContent = "Error: Please select both the RFQ and Proposal files.";
            return;
        }

        // Update UI to show loading
        status.textContent = "Processing files and running AI comparison... This may take up to 30 seconds.";
        resultArea.textContent = "Loading...";
        button.disabled = true; 
        button.style.backgroundColor = '#6c757d';

        // Use FormData to send files
        const formData = new FormData();
        formData.append('rfq', rfqInput.files[0]);
        formData.append('proposal', proposalInput.files[0]);

        // Your backend URL
        const BACKEND_URL = "https://compliance-backend-fxxb.onrender.com/compliance-check";

        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                body: formData, 
            });

            // Attempt to parse JSON response
            let data;
            try {
                data = await response.json();
            } catch (err) {
                throw new Error("Invalid JSON response from server.");
            }

            if (response.ok && data.success) {
                status.textContent = "Compliance check complete!";
                resultArea.innerHTML = marked.parse(data.result); 
            } else {
                status.textContent = "Compliance C
