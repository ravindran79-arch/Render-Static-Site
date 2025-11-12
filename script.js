const rfqInput = document.getElementById('rfqFile');
const proposalInput = document.getElementById('proposalFile');
const status = document.getElementById('status');
const resultArea = document.getElementById('resultArea');
const button = document.getElementById('checkComplianceButton');

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

button.addEventListener('click', async () => {
    if (!rfqInput.files.length || !proposalInput.files.length) {
        status.textContent = "Error: Please select both the RFQ and Proposal files.";
        return;
    }

    status.textContent = "Processing files and running AI comparison... This may take up to 30 seconds.";
    resultArea.textContent = "Loading...";
    button.disabled = true;
    button.style.backgroundColor = '#6c757d';

    try {
        const rfqText = await readFileAsText(rfqInput.files[0]);
        const proposalText = await readFileAsText(proposalInput.files[0]);

        const payload = { rfq: rfqText, proposal: proposalText };
        const BACKEND_URL = "https://compliance-backend-fxxb.onrender.com/compliance-check";

        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            status.textContent = "Compliance check complete!";
            resultArea.innerHTML = marked.parse(data.result || "No result returned.");
        } else {
            status.textContent = "Compliance Check Failed.";
            resultArea.textContent = `Error: ${data.error || "Unknown error"}`;
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
