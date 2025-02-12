import { NextRequest, NextResponse } from "next/server";
import Book from "@/app/lib/models/bookSchema";
import connect from "@/app/lib/db/mongoDB";

export async function POST(req: NextRequest) {
  connect();
  try {
    const data = await req.json();
    console.log(data);

    if (
      !data.title ||
      !data.condition ||
      !data.price ||
      !data.categories ||
      !data.stock
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new book
    const newBook = new Book({
      ...data,
      sold: 0,
      views: 0,
    });

    const savedBook = await newBook.save();
    console.log("saved book:", savedBook);
    return NextResponse.json(savedBook, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}

export async function GET() {
  connect();
  try {
    const books = await Book.find();
    return NextResponse.json(books);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
