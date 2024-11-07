"use client";

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/auth/msalConfig";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const { instance, accounts } = useMsal();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (accounts.length > 0) {
    router.push("/dashboard");
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/5 backdrop-blur-lg border-white/10">
        <div className="p-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Sign in with your Azure AD account to access your dashboard
            </p>
          </div>
          
          <Button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-600/40"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign in with Microsoft
          </Button>

          <p className="text-xs text-center text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </Card>
    </main>
  );
}