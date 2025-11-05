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
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState("monthly");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const subtotal = items.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0),
    0
  );
  const totalAmount = subtotal + (tax / 100) * subtotal;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [companyRes, clientRes] = await Promise.all([
          axios.get(`${backendUrl}/company`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/clients`, {
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
        `${backendUrl}/invoices`,
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
          isRecurring,
          recurrenceInterval: isRecurring ? recurrenceInterval : null,
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
    // <ProtectedRoute>
    <div className="max-w-xl mx-auto mt-12 bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
        🧾 Create New Invoice
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Company</h2>
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Client</h2>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Items</h2>
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
                className="flex-1 px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", e.target.value)
                }
                className="w-28 px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-600 mt-2"
                >
                  <Trash2 size={22} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium"
          >
            <PlusCircle size={18} /> Add Item
          </button>
        </div>

        {/* 🆕 Recurring Invoice Toggle */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">
            Recurring Invoice
          </h2>
          <div className="flex items-center gap-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={() => setIsRecurring(!isRecurring)}
                className="w-5 h-5 accent-amber-600"
              />
              <span className="ml-2 text-gray-800">
                Make this a recurring invoice
              </span>
            </label>
          </div>

          {isRecurring && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recurrence Interval
              </label>
              <select
                value={recurrenceInterval}
                onChange={(e) => setRecurrenceInterval(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}
        </div>

        {/* Due Date */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Due Date</h2>
          <DatePicker
            selected={dueDate ? new Date(dueDate) : null}
            // @ts-ignore
            onChange={(date: Date) =>
              setDueDate(date.toISOString().split("T")[0])
            }
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholderText="Select due date"
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
          />
        </div>

        {/* Payment Details */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">
            Payment Details
          </h2>
          <textarea
            value={paymentDetails}
            onChange={(e) => setPaymentDetails(e.target.value)}
            placeholder="Enter payment instructions (e.g., UPI, bank, PayPal)"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px]"
          />
        </div>

        {/* Tax */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Tax (%)</h2>
          <input
            type="number"
            placeholder="e.g., 18"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={tax}
            onChange={(e) => setTax(parseFloat(e.target.value))}
          />
        </div>

        {/* Total */}
        <div className="text-right text-gray-900 text-lg">
          Total:{" "}
          <span className="text-amber-600 font-semibold">
            ₹{totalAmount.toFixed(2)}
          </span>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 transition-all py-3 rounded-lg font-semibold text-white text-lg shadow-lg shadow-amber-300/30"
        >
          {loading ? "Creating..." : "Create Invoice"}
        </button>
      </form>
    </div>
    // </ProtectedRoute>
  );
}
