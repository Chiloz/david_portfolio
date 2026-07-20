import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, getDoc, setDoc } from "firebase/firestore";

// Initialize Firebase using server process variables or the fallback keys
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCQrsn1RVROyNdtigPVO7KgLqc7ApotEag",
  authDomain: "david-portfolio-71fcc.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "david-portfolio-71fcc",
  storageBucket: "david-portfolio-71fcc.firebasestorage.app",
  messagingSenderId: "903887227667",
  appId: "1:903887227667:web:af82248c4015a3795f68e6"
};

const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to support large Base64 image payloads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Route: GET projects
  app.get("/api/projects", async (req, res) => {
    try {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const projects = [];
      snapshot.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json(projects);
    } catch (error) {
      console.error("GET Projects Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: POST new project with Cloudinary Streaming
  app.post("/api/projects", async (req, res) => {
    try {
      const { title, description, techStack, imageBase64, projectUrl } = req.body;

      if (!title || !description || !techStack || !imageBase64) {
        return res.status(400).json({ error: "Missing required fields (title, description, techStack, imageBase64)" });
      }

      // 1. Upload Base64 image payload to Cloudinary
      const cloudinaryUrl = "https://api.cloudinary.com/v1_1/jzepzwix/image/upload";
      
      const formData = new URLSearchParams();
      formData.append("file", imageBase64);
      formData.append("upload_preset", "David_Portfolio");

      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(500).json({ error: errorData.error?.message || "Cloudinary Upload Failed" });
      }

      const cloudinaryData = await response.json();
      const secureUrl = cloudinaryData.secure_url;

      // 2. Save document record to Firestore containing text metadata and secure_url
      const docRef = await addDoc(collection(db, "projects"), {
        title,
        description,
        techStack,
        imageUrl: secureUrl,
        projectUrl: projectUrl || "",
        createdAt: new Date().toISOString()
      });

      res.status(201).json({
        id: docRef.id,
        title,
        description,
        techStack,
        imageUrl: secureUrl,
        message: "Project successfully created"
      });

    } catch (error) {
      console.error("POST Project Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: PUT edit existing project
  app.put("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, techStack, imageUrl } = req.body;

      const projectRef = doc(db, "projects", id);
      const docSnap = await getDoc(projectRef);

      if (!docSnap.exists()) {
        return res.status(404).json({ error: "Project not found" });
      }

      const updatedData: any = {};
      if (title !== undefined) updatedData.title = title;
      if (description !== undefined) updatedData.description = description;
      if (techStack !== undefined) updatedData.techStack = techStack;
      if (imageUrl !== undefined) updatedData.imageUrl = imageUrl;
      updatedData.updatedAt = new Date().toISOString();

      await updateDoc(projectRef, updatedData);

      res.status(200).json({ id, ...docSnap.data(), ...updatedData, message: "Project updated successfully" });
    } catch (error) {
      console.error("PUT Project Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: DELETE project
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const projectRef = doc(db, "projects", id);
      const docSnap = await getDoc(projectRef);

      if (!docSnap.exists()) {
        return res.status(404).json({ error: "Project not found" });
      }

      await deleteDoc(projectRef);
      res.status(200).json({ id, message: "Project deleted successfully" });
    } catch (error) {
      console.error("DELETE Project Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: GET skills
  app.get("/api/skills", async (req, res) => {
    try {
      const snapshot = await getDocs(collection(db, "skills"));
      const skills: any[] = [];
      snapshot.forEach((doc) => {
        skills.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json(skills);
    } catch (error: any) {
      console.error("GET Skills Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: POST new skill category
  app.post("/api/skills", async (req, res) => {
    try {
      const { category, items } = req.body;
      if (!category || !items) {
        return res.status(400).json({ error: "Missing required fields (category, items)" });
      }

      const docRef = await addDoc(collection(db, "skills"), {
        category,
        items, // Comma separated string e.g. "React, Next.js"
        createdAt: new Date().toISOString()
      });

      res.status(201).json({
        id: docRef.id,
        category,
        items,
        message: "Skill category created successfully"
      });
    } catch (error: any) {
      console.error("POST Skill Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: PUT edit skill category
  app.put("/api/skills/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { category, items } = req.body;

      const skillRef = doc(db, "skills", id);
      const docSnap = await getDoc(skillRef);

      if (!docSnap.exists()) {
        return res.status(404).json({ error: "Skill category not found" });
      }

      const updatedData: any = {};
      if (category !== undefined) updatedData.category = category;
      if (items !== undefined) updatedData.items = items;
      updatedData.updatedAt = new Date().toISOString();

      await updateDoc(skillRef, updatedData);
      res.status(200).json({ id, ...docSnap.data(), ...updatedData, message: "Skill category updated successfully" });
    } catch (error: any) {
      console.error("PUT Skill Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: DELETE skill category
  app.delete("/api/skills/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const skillRef = doc(db, "skills", id);
      const docSnap = await getDoc(skillRef);

      if (!docSnap.exists()) {
        return res.status(404).json({ error: "Skill category not found" });
      }

      await deleteDoc(skillRef);
      res.status(200).json({ id, message: "Skill category deleted successfully" });
    } catch (error: any) {
      console.error("DELETE Skill Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: GET global settings (including resume metadata and homepage customizations)
  app.get("/api/settings", async (req, res) => {
    try {
      const docRef = doc(db, "settings", "main_settings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // Return settings (exclude raw base64 from general settings fetch if too large, or return it)
        const data = docSnap.data();
        res.status(200).json(data);
      } else {
        // Return empty settings object
        res.status(200).json({});
      }
    } catch (error: any) {
      console.error("GET Settings Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: POST/PUT global settings
  app.post("/api/settings", async (req, res) => {
    try {
      const { 
        heroTitle, 
        heroSubtitle, 
        aboutText, 
        availableText, 
        phone, 
        email, 
        homeMediaBase64, 
        resumeBase64, 
        resumeFileName 
      } = req.body;

      const docRef = doc(db, "settings", "main_settings");
      const docSnap = await getDoc(docRef);

      let existingData = docSnap.exists() ? docSnap.data() : {};
      let updatedData: any = { ...existingData };

      if (heroTitle !== undefined) updatedData.heroTitle = heroTitle;
      if (heroSubtitle !== undefined) updatedData.heroSubtitle = heroSubtitle;
      if (aboutText !== undefined) updatedData.aboutText = aboutText;
      if (availableText !== undefined) updatedData.availableText = availableText;
      if (phone !== undefined) updatedData.phone = phone;
      if (email !== undefined) updatedData.email = email;
      if (resumeFileName !== undefined) updatedData.resumeFileName = resumeFileName;
      
      // If a new resume is uploaded as Base64
      if (resumeBase64) {
        updatedData.resumeBase64 = resumeBase64;
      }

      // If a new homepage media/image is uploaded as Base64, stream to Cloudinary
      if (homeMediaBase64) {
        const cloudinaryUrl = "https://api.cloudinary.com/v1_1/jzepzwix/image/upload";
        const formData = new URLSearchParams();
        formData.append("file", homeMediaBase64);
        formData.append("upload_preset", "David_Portfolio");

        const response = await fetch(cloudinaryUrl, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });

        if (response.ok) {
          const cloudinaryData = await response.json();
          updatedData.homeMediaUrl = cloudinaryData.secure_url;
        } else {
          console.error("Failed to upload home image to Cloudinary");
        }
      }

      updatedData.updatedAt = new Date().toISOString();

      await setDoc(docRef, updatedData);
      res.status(200).json({ message: "Settings updated successfully", settings: updatedData });
    } catch (error: any) {
      console.error("POST Settings Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: GET resume PDF download
  app.get("/api/resume/download", async (req, res) => {
    try {
      const docRef = doc(db, "settings", "main_settings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().resumeBase64) {
        const data = docSnap.data();
        const base64Data = data.resumeBase64;
        
        // Remove data:application/pdf;base64, prefix if it exists
        const actualBase64 = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data;
        const pdfBuffer = Buffer.from(actualBase64, "base64");
        
        const fileName = data.resumeFileName || "David_Chilengwa_Resume.pdf";
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        return res.send(pdfBuffer);
      } else {
        // Fallback text resume if none uploaded yet
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Content-Disposition", 'attachment; filename="David_Chilengwa_Resume_Fallback.txt"');
        const fallbackText = `DAVID CHILENGWA - PROFESSIONAL PORTFOLIO RESUME\n\nContact: +260768409033 | deavchile@gmail.com\nZambia\n\nFull-Stack Developer & IT Solutions Architect\n\nTECHNICAL SKILLS:\n- Web: Next.js, React, Tailwind CSS, HTML5, CSS3, ESNext\n- Backend & Cloud: Node.js, Express, Firebase Firestore, Cloud SQL, AWS Cloud\n- Infrastructure: DevOps, Kubernetes, Docker, Network Routing, Zero Trust Security\n\n(This is a text fallback resume. Admin can upload a real PDF resume in the Admin Dashboard setting to replace this fallback!)`;
        return res.send(fallbackText);
      }
    } catch (error: any) {
      console.error("Download Resume Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
