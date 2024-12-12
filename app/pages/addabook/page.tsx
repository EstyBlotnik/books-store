"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { addBook } from "../../services/bookService"; // Import the service

const AddABook = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<{
    name: string;
    condition: string;
    price: string;
    categories: string[];
    stock: string;
  }>({
    name: "",
    condition: "",
    price: "",
    categories: [],
    stock: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "categories" && type === "checkbox") {
      const { checked } = e.target;
      // אם התיבה נבדקה, נוסיף את הקטגוריה למערך, אם לא נבדקה, נסיר אותה
      const updatedCategories = checked
        ? [...formData.categories, value] // הוספת הקטגוריה שנבחרה
        : formData.categories.filter((category) => category !== value); // הסרת הקטגוריה אם לא נבחרה

      setFormData({
        ...formData,
        [name]: updatedCategories, // עדכון המערך עם הקטגוריות שנבחרו
      });
    } else {
      // עדכון שדות אחרים אם מדובר בשדה אחר
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
      // Call the service function to add the book
      const response = await addBook({
        name: formData.name,
        condition: formData.condition,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categories: formData.categories,
      });

      if (response.status === 200) {
        router.push("/books"); // Navigate to the books list after successful submission
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Add a New Book
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              Book Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="condition" className="block text-gray-700">
              Condition:
            </label>
            <select
              name="condition"
              id="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Condition</option>
              <option value="כחדש">כחדש</option>
              <option value="טוב">טוב</option>
              <option value="סביר">סביר</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700">
              Price:
            </label>
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label>Categories:</label>
            <div>
              {["Category1", "Category2", "Category3"].map((category) => (
                <div key={category}>
                  <input
                    type="checkbox"
                    id={category}
                    name="categories"
                    value={category}
                    checked={formData.categories.includes(category)}
                    onChange={handleInputChange}
                  />
                  <label htmlFor={category}>{category}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="stock" className="block text-gray-700">
              Stock:
            </label>
            <input
              type="number"
              name="stock"
              id="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddABook;
