import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    // 🔹 Conexión a la base de datos
    await connectDB();

    // 🔹 Obtener formData del request
    const formData = await req.formData();

    // 🔹 Convertir a objeto (para crear el evento luego)
    let event;
    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      console.error("Error al convertir formData:", e);
      return NextResponse.json(
        { message: "Invalid JSON data format" },
        { status: 400 }
      );
    }

    // 🔹 Obtener archivo 'image'
    const file = formData.get("image");

    // Validar que exista y que sea un archivo válido
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "Image file is required and must be valid" },
        { status: 400 }
      );
    }

    // 🔹 Convertir a buffer (necesario para Cloudinary)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🔹 Subir imagen a Cloudinary usando upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    // 🔹 Agregar URL de Cloudinary al objeto del evento
    event.image = (uploadResult as { secure_url: string }).secure_url;

    // 🔹 Guardar evento en MongoDB
    const createdEvent = await Event.create(event);

    return NextResponse.json(
      { message: "Event Created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (e) {
    console.error("Error al crear evento:", e);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 });
    }
}