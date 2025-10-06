"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2 } from "lucide-react";

export default function NewInvoicePage() {
  const router = useRouter();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [items, setItems] = useState([{ description: "", amount: "" }]);
  const [tax, setTax] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleItemChange = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const addItem = () => setItems([...items, { description: "", amount: "" }]);
  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const subtotal = items.reduce(
    (acc, item) => acc + (parseFloat(item.amount) || 0),
    0
  );
  const totalAmount = subtotal + (tax / 100) * subtotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/invoices",
        { clientName, clientEmail, items, tax, total: totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push("/dashboard/invoices");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md md:max-w-lg lg:max-w-xl mx-auto mt-12 bg-[#141021]/90 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg">
      <h1 className="text-2xl font-semibold flex items-center gap-2 mb-6">
        🧾 Create New Invoice
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Client Info */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-white">Client Info</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="e.g., John Doe"
              className="w-full px-4 py-3 rounded-lg bg-[#1d162f] border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="e.g., john.doe@example.com"
              className="w-full px-4 py-3 rounded-lg bg-[#1d162f] border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Items */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-white">Items</h2>
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Item or service description"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
                className="flex-1 px-4 py-3 rounded-lg bg-[#1d162f] border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="0.00"
                value={item.amount}
                onChange={(e) =>
                  handleItemChange(index, "amount", e.target.value)
                }
                className="w-28 px-4 py-3 rounded-lg bg-[#1d162f] border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-400 mt-2"
                >
                  <Trash2 size={22} />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            <PlusCircle size={18} /> Add Item
          </button>
        </div>

        {/* Tax */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-white">Tax (%)</h2>
          <input
            type="number"
            placeholder="e.g., 10"
            className="w-full px-4 py-3 rounded-lg bg-[#1d162f] border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={tax}
            onChange={(e) => setTax(parseFloat(e.target.value))}
          />
        </div>

        {/* Total */}
        <div className="text-right text-gray-300 text-lg">
          Total:{" "}
          <span className="text-indigo-400 font-semibold">
            ₹{totalAmount.toFixed(2)}
          </span>
        </div>

        {/* Error */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6a3df0] hover:bg-[#5930d4] transition-all py-3 rounded-lg font-semibold text-white text-lg shadow-lg shadow-indigo-500/30"
        >
          {loading ? "Creating..." : "Create Invoice"}
        </button>
      </form>
    </div>
  );
}
