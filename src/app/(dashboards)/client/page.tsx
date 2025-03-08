"use client"
import { Home, Users, Settings, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

// Define the Client type
type Client = {
  id: number;
  name: string;
  assignedStaff: string;
  progress: string;
  communication: string;
};

export default function ClientDashboard() {
  // State for clients
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: "John Doe",
      assignedStaff: "Jane Smith",
      progress: "50%",
      communication: "2 Unread Messages",
    },
    {
      id: 2,
      name: "Alice Johnson",
      assignedStaff: "Bob Brown",
      progress: "75%",
      communication: "1 Unread Message",
    },
  ]);

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // State for adding/editing a client
  const [isEditing, setIsEditing] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);

  // Handle search
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle add/edit client
  const handleAddClient = () => {
    setIsEditing(true);
    setCurrentClient({
      id: Date.now(),
      name: "",
      assignedStaff: "",
      progress: "",
      communication: "",
    });
  };

  const handleEditClient = (client: Client) => {
    setIsEditing(true);
    setCurrentClient(client);
  };

  const handleSaveClient = () => {
    if (currentClient) {
      if (clients.some((client) => client.id === currentClient.id)) {
        // Update existing client
        setClients((prevClients) =>
          prevClients.map((client) =>
            client.id === currentClient.id ? currentClient : client
          )
        );
      } else {
        // Add new client
        setClients((prevClients) => [...prevClients, currentClient]);
      }
      setIsEditing(false);
      setCurrentClient(null);
    }
  };

  // Handle delete client
  const handleDeleteClient = (id: number) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== id)
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <div className="flex items-center mb-8">
          <Home className="mr-2" />
          <span className="font-semibold">Client Dashboard</span>
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                <Users className="mr-2" />
                Clients
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                <MessageCircle className="mr-2" />
                Communication
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                <Settings className="mr-2" />
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <Input
            placeholder="Search clients..."
            className="w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleAddClient}>Add Client</Button>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Client Management</h2>

            {/* Add/Edit Client Form */}
            {isEditing && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {currentClient?.id ? "Edit Client" : "Add Client"}
                </h3>
                <div className="space-y-4">
                  <Input
                    placeholder="Client Name"
                    value={currentClient?.name || ""}
                    onChange={(e) =>
                      setCurrentClient((prev) =>
                        prev ? { ...prev, name: e.target.value } : null
                      )
                    }
                  />
                  <Input
                    placeholder="Assigned Staff"
                    value={currentClient?.assignedStaff || ""}
                    onChange={(e) =>
                      setCurrentClient((prev) =>
                        prev ? { ...prev, assignedStaff: e.target.value } : null
                      )
                    }
                  />
                  <Input
                    placeholder="Progress"
                    value={currentClient?.progress || ""}
                    onChange={(e) =>
                      setCurrentClient((prev) =>
                        prev ? { ...prev, progress: e.target.value } : null
                      )
                    }
                  />
                  <Input
                    placeholder="Communication"
                    value={currentClient?.communication || ""}
                    onChange={(e) =>
                      setCurrentClient((prev) =>
                        prev ? { ...prev, communication: e.target.value } : null
                      )
                    }
                  />
                  <Button onClick={handleSaveClient}>Save</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Client Table */}
            <Table>
              <TableCaption>A list of your clients.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Assigned Staff</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Communication</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.assignedStaff}</TableCell>
                    <TableCell>{client.progress}</TableCell>
                    <TableCell>{client.communication}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="mr-2"
                        onClick={() => handleEditClient(client)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </main>
      </div>
    </div>
  );
}
