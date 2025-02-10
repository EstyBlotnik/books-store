"use client";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addBook } from "../../services/bookService"; // Import the service
import { getCategories } from "../../services/categoryService"; // Service for fetching categories
import { getPublishers } from "@/app/services/publisherService";
import { uploadImage } from "@/app/services/uploadService";

const AddABook = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    tytle: string;
    condition: string;
    price: string;
    categories: string[];
    stock: string;
    author: string;
    publisher: string;
    coverType: string;
    yearOfPublication: string;
    description: string;
    rare: boolean;
    signed: boolean;
    salePrice: string;
  }>({
    tytle: "",
    condition: "",
    price: "",
    categories: [],
    stock: "",
    author: "",
    publisher: "",
    coverType: "",
    yearOfPublication: "",
    description: "",
    rare: false,
    signed: false,
    salePrice: "",
  });

  const [error, setError] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [publishers, setPublishers] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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

  useEffect(() => {
    console.log("imageUrl: ", imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await getPublishers(); // קריאה לפונקציה חדשה בשרת
        setPublishers(response);
      } catch (err) {
        setError("Failed to fetch publishers.");
      }
    };

    fetchPublishers();
  }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("Selected file:", file);
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await uploadImage(formData);
        setImageUrl(response.imageUrl);
      } catch (error) {
        setError("Failed to upload image.");
      }
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "categories" && type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      const updatedCategories = checked
        ? [...formData.categories, value]
        : formData.categories.filter((category) => category !== value);
      setFormData({
        ...formData,
        [name]: updatedCategories,
      });
    } else {
      if (type === "checkbox") {
        setFormData((prev) => ({
          ...prev,
          [name]: (e.target as HTMLInputElement).checked,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
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
        author: formData.author,
        publisher: formData.publisher || null,
        coverType: formData.coverType,
        yearOfPublication: parseInt(formData.yearOfPublication),
        description: formData.description || null,
        rare: formData.rare,
        signed: formData.signed,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        image: imageUrl,
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
          <div className="mb-4">
            <label htmlFor="author" className="block text-gray-700">
              שם הסופר:
            </label>
            <input
              type="text"
              name="author"
              id="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="publisher" className="block text-gray-700">
              מוציא לאור:
            </label>
            <select
              name="publisher"
              id="publisher"
              value={formData.publisher}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">בחר מוציא לאור</option>
              {publishers.map((publisher) => (
                <option key={publisher._id} value={publisher._id}>
                  {publisher.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="coverType" className="block text-gray-700">
              סוג כריכה:
            </label>
            <select
              name="coverType"
              id="coverType"
              value={formData.coverType}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">בחר סוג כריכה</option>
              <option value="רכה">רכה</option>
              <option value="קשה">קשה</option>
              <option value="קרטון">קרטון</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="yearOfPublication" className="block text-gray-700">
              שנת הוצאה לאור:
            </label>
            <input
              type="number"
              name="yearOfPublication"
              id="yearOfPublication"
              value={formData.yearOfPublication}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700">
              תיאור הספר:
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="rare"
              id="rare"
              checked={formData.rare}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="rare" className="text-gray-700">
              הספר נדיר
            </label>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="signed"
              id="signed"
              checked={formData.signed}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="signed" className="text-gray-700">
              הספר חתום
            </label>
          </div>
          <div className="mb-4">
            <label htmlFor="salePrice" className="block text-gray-700">
              מחיר מבצע (אם יש):
            </label>
            <input
              type="number"
              name="salePrice"
              id="salePrice"
              value={formData.salePrice}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {imageUrl && <img src={imageUrl} alt="Book Cover" width="150" />}

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
