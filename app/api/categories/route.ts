// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import Category from "../../lib/models/categorySchema"; // ודא שהנתיב נכון
import { log } from "console";
import { ClientPageRoot } from "next/dist/client/components/client-page";
import connect from "@/app/lib/db/mongoDB";

export async function GET() {
  connect();
  try {
    const categories = await Category.find();

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(request: NextRequest) {
  connect();
  try {
    const { name, parentCategory } = await request.json();
    console.log(name);
    console.log(parentCategory);

    if (!name || !parentCategory) {
      return NextResponse.json(
        { error: "Both name and parentCategory are required." },
        { status: 400 }
      );
    }

    const newCategory = new Category({ name, parentCategory });
    await newCategory.save();

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "An error occurred while creating the category." },
      { status: 500 }
    );
  }
}
