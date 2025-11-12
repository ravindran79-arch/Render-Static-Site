// ----------------------------
// script.js — Compliance Checker Frontend
// ----------------------------

// When the DOM loads
document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const resultDiv = document.getElementById("result");
  const loadingDiv = document.getElementById("loading");

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const rfqFile = document.getElementById("rfqFile").files[0];
    const proposalFile = document.getElementById("proposalFile").files[0];

    if (!rfqFile || !proposalFile) {
      alert("⚠️ Please upload both RFQ and Proposal files.");
      return;
    }

    const formData = new FormData();
    formData.append("files", rfqFile);
    formData.append("files", proposalFile);

    // Show loading
    loadingDiv.style.display = "block";
    resultDiv.innerText = "Processing files and running AI comparison... This may take up to 30 seconds.";

    try {
      // Backend API endpoint
      const response = await fetch("https://compliance-backend-fxxb.onrender.com/compliance-check", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Try to read the response body for debugging
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Expect JSON result from backend
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Show AI analysis result
      resultDiv.innerText = data.result || "No compliance findings were returned.";

    } catch (err) {
      console.error("Backend Error:", err);
      resultDiv.innerText = "❌ Error processing compliance check:\n" + err.message;
    } finally {
      // Hide loading spinner or message
      loadingDiv.style.display = "none";
    }
  });
});
