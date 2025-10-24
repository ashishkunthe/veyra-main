"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function NewInvoicePage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([{ description: "", price: "" }]);
  const [tax, setTax] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = items.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0),
    0
  );
  const totalAmount = subtotal + (tax / 100) * subtotal;

  // Fetch companies and clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [companyRes, clientRes] = await Promise.all([
          axios.get("http://localhost:4000/company", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4000/clients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCompanies(
          Array.isArray(companyRes.data) ? companyRes.data : [companyRes.data]
        );
        setClients(clientRes.data);
      } catch (err) {
        console.error("Error fetching company/client data:", err);
      }
    };
    fetchData();
  }, []);

  // Auto-fill client email
  useEffect(() => {
    if (clientId) {
      const selected = clients.find((c) => c.id === clientId);
      setClientEmail(selected?.email || "");
    }
  }, [clientId, clients]);

  const handleItemChange = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const addItem = () => setItems([...items, { description: "", price: "" }]);
  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !clientId) {
      setError(
        "Please select a company and client before creating an invoice."
      );
      return;
    }

    if (!paymentDetails.trim()) {
      setError("Please provide payment details before creating the invoice.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const selectedClient = clients.find((c) => c.id === clientId);
      await axios.post(
        "http://localhost:4000/invoices",
        {
          companyId,
          clientId,
          clientName: selectedClient?.name,
          clientEmail: selectedClient?.email,
          items: items.map((i) => ({
            qty: 1,
            description: i.description,
            price: parseFloat(i.price),
          })),
          tax,
          total: totalAmount,
          dueDate: dueDate,
          isRecurring: false,
          recurrenceInterval: null,
          paymentDetails,
        },
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
    <div className="max-w-xl mx-auto mt-12 bg-[#141021]/90 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg">
      <h1 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
        🧾 Create New Invoice
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-3 text-white">Company</h2>
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#1d162f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* Client Selection */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-white">Client</h2>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#1d162f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {/* Items */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-white">Items</h2>
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
                className="flex-1 px-4 py-3 rounded-lg bg-[#1d162f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", e.target.value)
                }
                className="w-28 px-4 py-3 rounded-lg bg-[#1d162f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        {/* Due Date */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-white">Due Date</h2>
          <DatePicker
            selected={dueDate ? new Date(dueDate) : null}
            // @ts-ignore
            onChange={(date: Date) =>
              setDueDate(date.toISOString().split("T")[0])
            }
            className="w-full px-4 py-3 rounded-lg bg-[#1d162f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholderText="Select due date"
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
          />
        </div>

        {/* 🧾 Payment Details (Now after Items) */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-white">
            Payment Details
          </h2>
          <textarea
            value={paymentDetails}
            onChange={(e) => setPaymentDetails(e.target.value)}
            placeholder="Enter payment instructions (e.g., UPI, bank, PayPal)"
            className="w-full px-4 py-3 rounded-lg bg-[#1d162f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
          />
        </div>

        {/* Tax */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-white">Tax (%)</h2>
          <input
            type="number"
            placeholder="e.g., 18"
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
