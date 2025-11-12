// ---------------- script.js ----------------

// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("complianceForm");
  const resultDiv = document.getElementById("result");
  const submitBtn = document.getElementById("submitBtn");

  if (!form) {
    console.error("Form not found in the DOM");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    resultDiv.innerHTML = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing files and running AI comparison... This may take up to 30 seconds...";

    try {
      const rfqFile = document.getElementById("rfq").files[0];
      const proposalFile = document.getElementById("proposal").files[0];

      if (!rfqFile || !proposalFile) {
        throw new Error("Please upload both RFQ and Proposal files");
      }

      const formData = new FormData();
      formData.append("rfq", rfqFile);
      formData.append("proposal", proposalFile);

      const response = await fetch("https://compliance-backend-fxxb.onrender.com/compliance-check", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      if (!data || !data.analysis) {
        throw new Error("Backend returned invalid response");
      }

      resultDiv.innerHTML = `<pre>${data.analysis}</pre>`;
    } catch (err) {
      console.error("Backend Error:", err);
      resultDiv.innerHTML = `<span style="color:red;">Error: ${err.message}</span>`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Check Compliance";
    }
  });
});
