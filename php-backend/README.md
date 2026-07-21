# 🐘 David Chilengwa's Portfolio PHP REST API Backend

This directory contains a complete, robust, and highly optimized PHP-native server implementation of your full-stack portfolio backend. It serves as a mirror replacement for `server.ts` to run seamlessly on PHP hosting platforms (such as **Render**, **Heroku**, **cPanel**, or **Vercel PHP serverless**).

---

## 🚀 Architectural Design & Advantages

1. **Native Dependencies Zero-Weight Design**: Built entirely using native PHP curl and standard JSON serialization functions. No composer packages are required, ensuring instant, rapid cold starts on serverless platforms.
2. **Direct Firebase/Firestore Integration**: Communicates directly with your Google Firebase Firestore database using the robust Google Firestore REST API, bypassing heavy Node or gRPC SDK wrappers.
3. **Streamlined Cloudinary Integration**: Uploads raw base64 encoded picture payloads seamlessly to Cloudinary via their secure HTTPS REST upload api.
4. **Universal CORS Headers Configured**: Ready to handle AJAX and `fetch` client requests directly from your React SPA hosted on Vercel.

---

## 🛠️ Deploying on Render (PHP Hosting Environment)

To deploy this backend as a Web Service on **Render**:

1. **Connect your GitHub Repository** containing this codebase to your **Render Dashboard**.
2. **Create a New Web Service**:
   - Choose the branch where this code resides (e.g., `main`).
   - Select **Runtime**: `PHP`.
   - Set **Build Command**: (leave blank, or enter `echo "Build Ready"`).
   - Set **Start Command**: `php -S 0.0.0.0:10000 -t php-backend/`. This commands PHP's built-in web server to serve the API files directly on port `10000`.
3. **Configure Environment Variables**:
   Navigate to the **Environment** tab in your Render Web Service dashboard and insert the following secret keys:
   - `FIREBASE_PROJECT_ID` = `david-portfolio-71fcc`
   - `CLOUDINARY_CLOUD_NAME` = `jzepzwix`
   - `CLOUDINARY_UPLOAD_PRESET` = `David_Portfolio`

Your Render URL will look like: `https://david-portfolio-backend.onrender.com`.

---

## 🎯 Linking your Vercel Front-End with your Render PHP Backend

If you run your beautiful React application on **Vercel** and your PHP backend on **Render**, update the `fetch` URLs in your React code to point to your new live Render PHP API link.

For example, in `/app/page.jsx` or your custom API utility helper:
```javascript
// From:
const projRes = await fetch("/api/projects");

// To (points directly to your custom PHP backend domain):
const projRes = await fetch("https://david-portfolio-backend.onrender.com/api/projects");
```

---

## 📂 REST Endpoints Documented

All response payloads match the exact data structure used by the standard React frontend:

* **GET `/api/projects`** - Lists all projects sorted by creation date descending.
* **POST `/api/projects`** - Uploads base64 image to Cloudinary and saves database record.
* **PUT `/api/projects/:id`** - Modifies an existing project record's text fields.
* **DELETE `/api/projects/:id`** - Deletes a project record by ID.
* **GET `/api/skills`** - Lists all technical skill nodes.
* **POST `/api/skills`** - Adds a new skill category.
* **PUT `/api/skills/:id`** - Modifies a skill item details.
* **DELETE `/api/skills/:id`** - Removes a skill node.
* **GET `/api/settings`** - Fetches current global portfolio headings and custom metadata.
* **POST `/api/settings`** - Updates titles, descriptions, contacts, and custom uploaded media/resume.
* **GET `/api/resume/download`** - Streams your uploaded resume PDF download directly to the client browser (falls back to a standard text summary if no PDF is uploaded).
