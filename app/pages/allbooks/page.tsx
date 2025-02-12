"use client";
import { getAllBooks } from "@/app/services/bookService";
import IBook from "@/app/types/IBook";
import mongoose from "mongoose";
import { useState, useEffect } from "react";

export default function BooksPage() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await getAllBooks();
        console.log(response);
        setBooks(response);
      } catch (err) {
        setError("Failed to fetch books");
        console.error(err);
      }
    }
    fetchBooks();
  }, []);

  if (error)
    return (
      <div style={{ textAlign: "center", color: "red", marginTop: "20px" }}>
        <p>{error}</p>
      </div>
    );

  return (
    <div style={{ padding: "20px", direction: "rtl" }}>
      <h2 style={{ textAlign: "center" }}>רשימת הספרים</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {books.map((book) => (
          <div
            key={book.title}
            style={{
              width: "250px",
              margin: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              background: "#fff",
            }}
          >
            {book.image && (
              <img
                src={book.image}
                alt={book.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
            )}
            <div style={{ padding: "10px" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "5px" }}>
                {book.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#555" }}>
                <strong>מחבר:</strong> {book.author}
              </p>
              <p style={{ fontSize: "14px", color: "#555" }}>
                <strong>מצב:</strong> {book.condition}
              </p>
              <p style={{ fontSize: "14px", color: "#555" }}>
                <strong>מחיר:</strong> ₪{book.price}
              </p>
              <p style={{ fontSize: "14px", color: "#555" }}>
                <strong>קטגוריות:</strong>
              </p>
              {Array.isArray(book.categories) &&
                book.categories.every(
                  (category) => typeof category !== "string"
                ) &&
                book.categories.map((category) => (
                  <p
                    key={category?.name}
                    style={{ fontSize: "14px", color: "#555" }}
                  >
                    {category?.name}
                  </p>
                ))}

              {book.publisher && (
                <p style={{ fontSize: "14px", color: "#555" }}>
                  <strong>הוצאה לאור:</strong>{" "}
                  {book.publisher instanceof mongoose.Types.ObjectId
                    ? null
                    : book.publisher.name}
                </p>
              )}
              {book.salePrice && (
                <p style={{ fontSize: "14px", color: "red" }}>
                  <strong>מחיר במבצע:</strong> ₪{book.salePrice}
                </p>
              )}
              <p style={{ fontSize: "14px", color: "#555" }}>
                <strong>מלאי:</strong> {book.stock}
              </p>
              <p style={{ fontSize: "14px", color: "#555" }}>
                <strong>סוג כריכה:</strong> {book.coverType}
              </p>
              <p style={{ fontSize: "14px", color: "#555" }}>
                <strong>שנת הוצאה לאור:</strong> {book.yearOfPublication}
              </p>
              {book.description && (
                <p style={{ fontSize: "14px", color: "#777" }}>
                  <strong>תיאור:</strong> {book.description}
                </p>
              )}
              {book.rare && (
                <p style={{ fontSize: "14px", color: "gold" }}>
                  <strong>ספר נדיר</strong>
                </p>
              )}
              {book.signed && (
                <p style={{ fontSize: "14px", color: "blue" }}>
                  <strong>עותק חתום</strong>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
