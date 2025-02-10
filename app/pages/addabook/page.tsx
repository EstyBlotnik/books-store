"use client";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addBook } from "../../services/bookService"; // Import the service
import { getCategories } from "../../services/categoryService"; // Service for fetching categories

const AddABook = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    tytle: string;
    condition: string;
    price: string;
    categories: string[];
    stock: string;
  }>({
    tytle: "",
    condition: "",
    price: "",
    categories: [],
    stock: "",
  });

  const [error, setError] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        console.log(response);
        setCategories(response);
      } catch (err) {
        setError("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "categories" && type === "checkbox") {
      const { checked } = e.target;
      const updatedCategories = checked
        ? [...formData.categories, value] 
        : formData.categories.filter((category) => category !== value);
      setFormData({
        ...formData,
        [name]: updatedCategories, 
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("submitting");
    e.preventDefault();
    setError("");
    // Validate inputs
    if (
      !formData.tytle ||
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
        tytle: formData.tytle,
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
          הוספת ספר חדש
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              שם הספר:
            </label>
            <input
              type="text"
              name="tytle"
              id="name"
              value={formData.tytle}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="condition" className="block text-gray-700">
              מצב הספר:
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
              מחיר:
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

          <div className="mb-4">
            <label>Categories:</label>
            <div>
              {categories.map((category) => (
                <div key={category._id}>
                  <input
                    type="checkbox"
                    name="categories"
                    value={category._id}
                    onChange={handleInputChange}
                    checked={formData.categories.includes(category._id)}
                  />
                  <label htmlFor={category._id}>{category.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="stock" className="block text-gray-700">
              כמות במלאי:
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
            הוסף את הספר
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddABook;
