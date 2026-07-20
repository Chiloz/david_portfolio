// app/api/projects/[id]/route.js
import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebase";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, description, techStack, imageUrl } = body;

    const projectRef = doc(db, "projects", id);
    const docSnap = await getDoc(projectRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updatedData = {};
    if (title !== undefined) updatedData.title = title;
    if (description !== undefined) updatedData.description = description;
    if (techStack !== undefined) updatedData.techStack = techStack;
    if (imageUrl !== undefined) updatedData.imageUrl = imageUrl;
    updatedData.updatedAt = new Date().toISOString();

    await updateDoc(projectRef, updatedData);

    return NextResponse.json({ id, ...docSnap.data(), ...updatedData, message: "Project updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const projectRef = doc(db, "projects", id);
    const docSnap = await getDoc(projectRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await deleteDoc(projectRef);

    return NextResponse.json({ id, message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
