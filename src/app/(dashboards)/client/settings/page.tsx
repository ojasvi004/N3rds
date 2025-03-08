import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <div className="flex items-center mb-8">
          <span className="font-semibold">Settings</span>
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                Profile
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                Security
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                Notifications
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <Input placeholder="Search settings..." className="w-64" />
          <Button>Save Changes</Button>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div className="space-y-4">
              <Input placeholder="Username" />
              <Input placeholder="Email" />
              <Input placeholder="Password" type="password" />
              <Button>Save Changes</Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
