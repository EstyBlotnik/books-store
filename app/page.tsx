import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">ברוכים הבאים לספרייה</h1>
      <p className="text-lg text-gray-700 mb-4">
        הוסיפו ספרים בקלות ולנהל את האוסף שלכם.
      </p>
      <Link href="/pages/addabook">
        <button className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
          הוספת ספר
        </button>
      </Link>
      <Link href={"/pages/allbooks"}>
        <button className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
          לצפייה בכל הספרים
        </button>
      </Link>
    </div>
  );
}
