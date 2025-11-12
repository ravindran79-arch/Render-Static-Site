// ---------------- script.js (updated for JSON text upload) ----------------

document.getElementById('checkComplianceButton').addEventListener('click', async () => {
    const rfqInput = document.getElementById('rfqFile');
    const proposalInput = document.getElementById('proposalFile');
    const status = document.getElementById('status');
    const resultArea = document.getElementById('resultArea');
    const button = document.getElementById('checkComplianceButton');

    // Check for file selection
    if (rfqInput.files.length === 0 || proposalInput.files.length === 0) {
        status.textContent = "Error: Please select both the RFQ and Proposal files.";
        return;
    }

    // Update UI to show loading
    status.textContent = "Processing files and running AI comparison... This may take up to 30 seconds.";
    resultArea.textContent = "Loading...";
    button.disabled = true; 
    button.style.backgroundColor = '#6c757d';

    // Helper function to read file as text
    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    try {
        // Read files as text
        const rfqText = await readFileAsText(rfqInput.files[0]);
        const proposalText = await readFileAsText(proposalInput.files[0]);

        // Prepare JSON payload
        const payload = { rfqText, proposalText };

        // Send request to backend
        const response = await fetch("https://compliance-backend-fxxb.onrender.com/compliance-check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            status.textContent = "Compliance check complete!";
            resultArea.innerHTML = marked.parse(data.result);
        } else {
            status.textContent = "Compliance Check Failed.";
            resultArea.textContent = `Error: ${data.error || "An unknown server error occurred."}`;
            console.error("Backend Error:", data.error);
        }

    } catch (e) {
        status.textContent = "Error: Failed to connect to the backend server.";
        resultArea.textContent = "There was a network error. Check your server URL and CORS settings.";
        console.error("Network Fetch Error:", e);
    } finally {
        button.disabled = false;
        button.style.backgroundColor = '#28a745';
    }
});
