"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const AddABook = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    condition: "",
    price: "",
    categories: "",
    stock: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    // Validate inputs
    if (
      !formData.name ||
      !formData.condition ||
      !formData.price ||
      !formData.categories ||
      !formData.stock
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          categories: formData.categories.split(",").map((cat) => cat.trim()),
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to add the book.");
      }

      router.push("/books"); // Navigate to the books list after successful submission
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        // Handle case where error is not an instance of Error (e.g., custom errors)
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div>
      <h1>Add a New Book</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Book Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Condition:</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
          >
            <option value="">Select Condition</option>
            <option value="כחדש">כחדש</option>
            <option value="טוב">טוב</option>
            <option value="סביר">סביר</option>
          </select>
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
          />
        </div>
        <div>
          <label>Categories (comma-separated):</label>
          <input
            type="text"
            name="categories"
            value={formData.categories}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            min="0"
          />
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddABook;
