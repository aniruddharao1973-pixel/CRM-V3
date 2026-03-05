import { useState } from "react";
import Modal from "../../components/Modal";
import SearchBar from "../../components/SearchBar";

const ContactLookupModal = ({
  open,
  onClose,
  contacts = [],
  onSelect,
}) => {
  const [search, setSearch] = useState("");

  const filtered = contacts.filter((c) =>
    `${c.firstName} ${c.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Modal open={open} onClose={onClose} title="Choose Contact" size="xl">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by Contact Name"
      />

      <div className="mt-4 border rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3"></th>
              <th className="text-left">Contact Name</th>
              <th className="text-left">Account Name</th>
              <th className="text-left">Email</th>
              <th className="text-left">Phone</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect(c)}
              >
                <td className="p-3">
                  <input type="radio" readOnly />
                </td>

                <td className="py-2">
                  {c.firstName} {c.lastName}
                </td>

                <td>{c.account?.accountName}</td>
                <td>{c.email}</td>
                <td>{c.phone || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default ContactLookupModal;