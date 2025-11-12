// script.js
console.log("🚀 Frontend script loaded");

const form = document.getElementById("upload-form");
const fileInput = document.getElementById("file-input");
const checkBtn = document.getElementById("check-btn");
const resultsDiv = document.getElementById("results");

// Validate essential DOM elements
if (!form || !fileInput || !checkBtn || !resultsDiv) {
  console.error("❌ One or more required DOM elements are missing");
} else {
  console.log("✅ All required DOM elements found");

  checkBtn.addEventListener("click", async () => {
    const files = fileInput.files;
    if (!files || files.length === 0) {
      alert("Please upload at least one file to analyze.");
      return;
    }

    resultsDiv.innerHTML = "<p>⏳ Uploading and analyzing files...</p>";

    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    try {
      const response = await fetch("/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server error: ${response.status} – ${errText}`);
      }

      const data = await response.json();
      console.log("✅ Analysis result:", data);

      if (data.error) {
        resultsDiv.innerHTML = `<p style="color:red;">⚠️ Error: ${data.error}</p>`;
      } else {
        resultsDiv.innerHTML = `
          <h2>Compliance Results</h2>
          <pre>${data.analysis}</pre>
        `;
      }
    } catch (err) {
      console.error("❌ Error during analysis:", err);
      resultsDiv.innerHTML = `<p style="color:red;">❌ ${err.message}</p>`;
    }
  });
}
