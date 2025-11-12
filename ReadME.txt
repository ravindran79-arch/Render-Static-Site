# Compliance Checker Frontend

## How to deploy on Render Static Site

1. Go to [https://render.com](https://render.com) and sign in.
2. Click **New → Static Site**.
3. You can either:
   - Connect a GitHub repo containing this folder, or
   - Choose **Manual Deploy** and upload the folder.
4. Make sure your backend URL in `script.js` is correct:
   ```js
   const BACKEND_URL = "https://compliance-backend-fxxb.onrender.com/api/compliance-check";
