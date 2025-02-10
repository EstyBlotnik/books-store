// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongoDB";
import Publisher from "@/app/lib/models/publisherSchema";

export async function GET() {
  connect();
  try {
    const publishers = await Publisher.find();

    return NextResponse.json(publishers);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(request: NextRequest) {
  connect();
  try {
    const { name } = await request.json();
    console.log(name);
    if (!name ) {
      return NextResponse.json(
        { error: "name is required." },
        { status: 400 }
      );
    }

    const newPublisher = new Publisher({ name });
    await newPublisher.save();

    return NextResponse.json(newPublisher, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "An error occurred while creating the category." },
      { status: 500 }
    );
  }
}
