"use client";

import { AuthenticatedContent } from "@/lib/auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { UserNav } from "@/components/dashboard/user-nav";
import { LayoutDashboard, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <AuthenticatedContent>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav className="border-b bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <LayoutDashboard className="h-6 w-6 text-blue-600" />
                <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full" />
                </Button>
                <UserNav />
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-2">Welcome</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  You are now signed in with your Azure AD account.
                </p>
              </Card>
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Access your most frequently used features here.
                </p>
              </Card>
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  View your latest actions and updates.
                </p>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthenticatedContent>
  );
}