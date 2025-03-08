"use client";
import { useState, useEffect } from "react";
import {
  Home,
  Users,
  Settings,
  MessageCircle,
  Search,
  Plus,
  Edit,
  Trash,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

// Define types
type Client = {
  id: number;
  name: string;
  assignedStaff: string;
  staffAvatar?: string;
  progressValue: number;
  progressStatus: "not-started" | "in-progress" | "at-risk" | "completed";
  communication: number;
  email: string;
  phone: string;
  dateAdded: string;
  lastContact: string;
  notes: string;
};

type Staff = {
  id: number;
  name: string;
  avatar?: string;
  role: string;
  clients: number;
};

export default function ClientDashboard() {
  // Sample staff data
  const staffMembers: Staff[] = [
    { id: 1, name: "Jane Smith", role: "Case Manager", clients: 8 },
    { id: 2, name: "Bob Brown", role: "Support Specialist", clients: 5 },
    { id: 3, name: "Maria Rodriguez", role: "Intake Coordinator", clients: 7 },
    { id: 4, name: "David Chen", role: "Case Manager", clients: 6 },
  ];

  // State for clients
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: "John Doe",
      assignedStaff: "Jane Smith",
      progressValue: 50,
      progressStatus: "in-progress",
      communication: 2,
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      dateAdded: "2023-09-15",
      lastContact: "2023-10-30",
      notes: "Client is making good progress with their goals.",
    },
    {
      id: 2,
      name: "Alice Johnson",
      assignedStaff: "Bob Brown",
      progressValue: 75,
      progressStatus: "in-progress",
      communication: 1,
      email: "alice.j@example.com",
      phone: "(555) 987-6543",
      dateAdded: "2023-08-22",
      lastContact: "2023-10-28",
      notes: "Recently completed phase 2 of their program.",
    },
    {
      id: 3,
      name: "Michael Williams",
      assignedStaff: "Maria Rodriguez",
      progressValue: 25,
      progressStatus: "at-risk",
      communication: 4,
      email: "michael.w@example.com",
      phone: "(555) 345-6789",
      dateAdded: "2023-10-05",
      lastContact: "2023-10-25",
      notes: "Missed last two appointments. Needs follow-up.",
    },
    {
      id: 4,
      name: "Sarah Taylor",
      assignedStaff: "David Chen",
      progressValue: 100,
      progressStatus: "completed",
      communication: 0,
      email: "sarah.t@example.com",
      phone: "(555) 456-7890",
      dateAdded: "2023-07-10",
      lastContact: "2023-10-20",
      notes: "Successfully completed all program requirements.",
    },
  ]);

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // State for dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

  // State for client being edited
  const [currentClient, setCurrentClient] = useState<Client | null>(null);

  // State for active tab
  const [activeTab, setActiveTab] = useState("all");

  // State for deletion confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // State for notifications
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Handle search and filtering
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.assignedStaff.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "at-risk")
      return matchesSearch && client.progressStatus === "at-risk";
    if (activeTab === "in-progress")
      return matchesSearch && client.progressStatus === "in-progress";
    if (activeTab === "completed")
      return matchesSearch && client.progressStatus === "completed";
    return matchesSearch;
  });

  // Handle showing notification
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({
      show: true,
      message,
      type,
    });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Handle add client
  const handleAddClient = () => {
    setDialogMode("add");
    setCurrentClient({
      id: Date.now(),
      name: "",
      assignedStaff: "",
      progressValue: 0,
      progressStatus: "not-started",
      communication: 0,
      email: "",
      phone: "",
      dateAdded: new Date().toISOString().split("T")[0],
      lastContact: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setIsDialogOpen(true);
  };

  // Handle edit client
  const handleEditClient = (client: Client) => {
    setDialogMode("edit");
    setCurrentClient({ ...client });
    setIsDialogOpen(true);
  };

  // Handle save client
  const handleSaveClient = () => {
    if (!currentClient) return;

    if (dialogMode === "edit") {
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === currentClient.id ? currentClient : client
        )
      );
      showNotification("Client updated successfully", "success");
    } else {
      setClients((prevClients) => [...prevClients, currentClient]);
      showNotification("New client added successfully", "success");
    }

    setIsDialogOpen(false);
  };

  // Handle delete client
  const handleDeleteClient = (id: number) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== id)
    );
    setDeleteConfirmId(null);
    showNotification("Client deleted successfully", "success");
  };

  const getStatusBadge = (status: Client["progressStatus"]) => {
    switch (status) {
      case "at-risk":
        return <Badge variant="destructive">At Risk</Badge>;
      case "in-progress":
        return (
          <Badge variant="default" className="bg-blue-500">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            Completed
          </Badge>
        );
      case "not-started":
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return null;
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Effect to clear notification
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-6 hidden md:block">
        <div className="flex items-center gap-2 mb-8">
          <Home className="text-blue-600" />
          <span className="font-bold text-lg">Client Dashboard</span>
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <a
                href="#"
                className="flex items-center text-blue-600 font-medium"
              >
                <Users className="mr-2 h-5 w-5" />
                Clients
              </a>
            </li>
            <li>
              <a
                href="/client/communication"
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Communication
              </a>
            </li>
            <li>
              <a
                href="/client/settings"
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </a>
            </li>
          </ul>
        </nav>

        {/* Staff Section */}
        <div className="mt-12">
          <h3 className="font-medium text-gray-500 mb-4">Staff Members</h3>
          <div className="space-y-3">
            {staffMembers.map((staff) => (
              <div key={staff.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {staff.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{staff.name}</p>
                  <p className="text-xs text-gray-500">
                    {staff.clients} clients
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients..."
              className="pl-8 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddClient} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Client
          </Button>
        </header>

        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md flex items-center gap-2 ${
              notification.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {notification.type === "success" ? (
              <Check className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{notification.message}</span>
            <button
              onClick={() =>
                setNotification((prev) => ({ ...prev, show: false }))
              }
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Client Management
            </h1>
            <p className="text-gray-500">Manage and track client information</p>
          </div>

          <Card className="overflow-hidden">
            <div className="p-6 border-b">
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">
                    All Clients ({clients.length})
                  </TabsTrigger>
                  <TabsTrigger value="at-risk">
                    At Risk (
                    {
                      clients.filter((c) => c.progressStatus === "at-risk")
                        .length
                    }
                    )
                  </TabsTrigger>
                  <TabsTrigger value="in-progress">
                    In Progress (
                    {
                      clients.filter((c) => c.progressStatus === "in-progress")
                        .length
                    }
                    )
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed (
                    {
                      clients.filter((c) => c.progressStatus === "completed")
                        .length
                    }
                    )
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Client Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Assigned Staff</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Communication</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-gray-500">
                              {client.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {client.assignedStaff
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {client.assignedStaff}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-full">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{client.progressValue}%</span>
                            </div>
                            <Progress
                              value={client.progressValue}
                              className="h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(client.progressStatus)}
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center">
                                  <MessageCircle className="h-4 w-4 mr-1 text-gray-500" />
                                  <span>{client.communication}</span>
                                  {client.communication > 0 && (
                                    <span className="ml-1 text-xs">unread</span>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Last contacted: {client.lastContact}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right">
                          {deleteConfirmId === client.id ? (
                            <div className="flex justify-end items-center gap-2">
                              <span className="text-sm">Confirm?</span>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteClient(client.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteConfirmId(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClient(client)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 border-red-200 hover:bg-red-50"
                                onClick={() => setDeleteConfirmId(client.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No clients found. Try adjusting your search or add a new
                        client.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </main>
      </div>

      {/* Add/Edit Client Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "add" ? "Add New Client" : "Edit Client"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                placeholder="Full name"
                value={currentClient?.name || ""}
                onChange={(e) =>
                  setCurrentClient((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={currentClient?.email || ""}
                  onChange={(e) =>
                    setCurrentClient((prev) =>
                      prev ? { ...prev, email: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="(555) 123-4567"
                  value={currentClient?.phone || ""}
                  onChange={(e) =>
                    setCurrentClient((prev) =>
                      prev ? { ...prev, phone: e.target.value } : null
                    )
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="staff">Assigned Staff</Label>
              <Select
                value={currentClient?.assignedStaff || ""}
                onValueChange={(value) =>
                  setCurrentClient((prev) =>
                    prev ? { ...prev, assignedStaff: value } : null
                  )
                }
              >
                <SelectTrigger id="staff">
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.name}>
                      {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="progress">
                Progress ({currentClient?.progressValue || 0}%)
              </Label>
              <Input
                id="progress"
                type="range"
                min="0"
                max="100"
                value={currentClient?.progressValue || 0}
                onChange={(e) =>
                  setCurrentClient((prev) =>
                    prev
                      ? { ...prev, progressValue: parseInt(e.target.value) }
                      : null
                  )
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={currentClient?.progressStatus || "not-started"}
                onValueChange={(value: Client["progressStatus"]) =>
                  setCurrentClient((prev) =>
                    prev ? { ...prev, progressStatus: value } : null
                  )
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                rows={3}
                className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Client notes..."
                value={currentClient?.notes || ""}
                onChange={(e) =>
                  setCurrentClient((prev) =>
                    prev ? { ...prev, notes: e.target.value } : null
                  )
                }
              ></textarea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveClient}>
              {dialogMode === "add" ? "Add Client" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
