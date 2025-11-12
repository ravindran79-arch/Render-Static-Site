// script.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("complianceForm");
  const rfqInput = document.getElementById("rfqFile");
  const proposalInput = document.getElementById("proposalFile");
  const output = document.getElementById("analysisOutput");

  if (!form || !rfqInput || !proposalInput || !output) {
    console.error("❌ One or more required DOM elements are missing");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    output.textContent = "Processing files and running AI comparison...";

    try {
      // Read RFQ file
      const rfqFile = rfqInput.files[0];
      const proposalFile = proposalInput.files[0];

      if (!rfqFile || !proposalFile) {
        output.textContent = "Please upload both RFQ and Proposal files.";
        return;
      }

      const rfqText = await rfqFile.text();
      const proposalText = await proposalFile.text();

      // Call backend compliance-check endpoint
      const response = await fetch(
        "https://compliance-backend-fxxb.onrender.com/compliance-check",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rfqText, proposalText }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP ${response.status}: ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();
      output.textContent = data.analysis || "No analysis returned.";
    } catch (err) {
      console.error("Backend Error:", err);
      output.textContent = `Backend Error: ${err.message}`;
    }
  });
});
