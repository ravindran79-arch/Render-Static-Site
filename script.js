function setupDropZone(dropZoneId, inputId) {
    const dropZone = document.getElementById(dropZoneId);
    const input = document.getElementById(inputId);

    dropZone.addEventListener('click', () => input.click());
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.style.backgroundColor = '#e6f0ff'; });
    dropZone.addEventListener('dragleave', e => { e.preventDefault(); dropZone.style.backgroundColor = ''; });
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.style.backgroundColor = '';
        if (e.dataTransfer.files.length > 0) {
            input.files = e.dataTransfer.files;
            dropZone.textContent = e.dataTransfer.files[0].name;
        }
    });

    input.addEventListener('change', () => {
        if (input.files.length > 0) dropZone.textContent = input.files[0].name;
    });
}

setupDropZone('rfqDropZone', 'rfqFile');
setupDropZone('proposalDropZone', 'proposalFile');

async function simulateStep(stepText, duration = 1000) {
    document.getElementById('status').textContent = stepText;
    return new Promise(resolve => setTimeout(resolve, duration));
}

document.getElementById('checkComplianceButton').addEventListener('click', async () => {
    const rfqInput = document.getElementById('rfqFile');
    const proposalInput = document.getElementById('proposalFile');
    const status = document.getElementById('status');
    const resultArea = document.getElementById('resultArea');
    const spinner = document.getElementById('spinner');
    const button = document.getElementById('checkComplianceButton');

    if (rfqInput.files.length === 0 || proposalInput.files.length === 0) {
        status.textContent = "Error: Please select both the RFQ and Proposal files.";
        return;
    }

    button.disabled = true;
    spinner.style.display = 'block';
    resultArea.textContent = "";

    try {
        await simulateStep("Step 1/3: Uploading files...", 1500);

        const formData = new FormData();
        formData.append('rfq', rfqInput.files[0]);
        formData.append('proposal', proposalInput.files[0]);

        await simulateStep("Step 2/3: AI analyzing documents...", 1500);

        const BACKEND_URL = "https://compliance-backend-fxxb.onrender.com/api/compliance-check";
        const response = await fetch(BACKEND_URL, { method: 'POST', body: formData });
        const data = await response.json();

        await simulateStep("Step 3/3: Finalizing results...", 1000);

        if (response.ok && data.success) {
            status.textContent = "Compliance check complete!";
            resultArea.innerHTML = marked.parse(data.result);
        } else {
            status.textContent = "Compliance Check Failed.";
            resultArea.textContent = `Error: ${data.error || "Unknown server error."}`;
            console.error("Backend Error:", data.error);
        }
    } catch(e) {
        status.textContent = "Error: Failed to connect to backend server.";
        resultArea.textContent = "Check your server URL and CORS settings.";
        console.error(e);
    } finally {
        spinner.style.display = 'none';
        button.disabled = false;
    }
});
