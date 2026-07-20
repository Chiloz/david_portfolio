// app/api/projects/route.js
import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

export async function GET() {
  try {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const projects = [];
    snapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, techStack, imageBase64 } = body;

    if (!title || !description || !techStack || !imageBase64) {
      return NextResponse.json({ error: "Missing required fields (title, description, techStack, imageBase64)" }, { status: 400 });
    }

    // 1. Upload Base64 image payload to Cloudinary
    const cloudinaryUrl = "https://api.cloudinary.com/v1_1/jzepzwix/image/upload";
    
    // Cloudinary REST upload payload
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
      return NextResponse.json({ error: errorData.error?.message || "Cloudinary Upload Failed" }, { status: 500 });
    }

    const cloudinaryData = await response.json();
    const secureUrl = cloudinaryData.secure_url;

    // 2. Save document record to Firestore containing text metadata and secure_url
    const docRef = await addDoc(collection(db, "projects"), {
      title,
      description,
      techStack,
      imageUrl: secureUrl,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      id: docRef.id,
      title,
      description,
      techStack,
      imageUrl: secureUrl,
      message: "Project successfully created"
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
