document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('compliance-form');
  const status = document.getElementById('status');
  const result = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rfqFile = document.getElementById('rfq-file').files[0];
    const proposalFile = document.getElementById('proposal-file').files[0];

    if (!rfqFile || !proposalFile) {
      alert('Please select both RFQ and Proposal files.');
      return;
    }

    const rfqText = await rfqFile.text();
    const proposalText = await proposalFile.text();

    status.textContent = 'Processing files and running AI compliance analysis... This may take up to 30 seconds.';
    result.textContent = '';

    try {
      const response = await fetch('https://compliance-backend-fxxb.onrender.com/compliance-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rfqText,
          proposalText
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      status.textContent = 'Compliance check complete.';
      result.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      status.textContent = 'Error during compliance check.';
      result.textContent = `Backend Error: ${err.message}`;
      console.error(err);
    }
  });
});
