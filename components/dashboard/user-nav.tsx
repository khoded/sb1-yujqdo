"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMsal } from "@azure/msal-react";
import { useRouter } from "next/navigation";
import { Settings, User, CreditCard, LogOut } from "lucide-react";
import { loginRequest, graphConfig } from "@/lib/auth/msalConfig";

interface UserData {
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
  id?: string;
}

export function UserNav() {
  const { instance } = useMsal();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const account = instance.getActiveAccount();
      if (!account) {
        const accounts = instance.getAllAccounts();
        if (accounts.length > 0) {
          instance.setActiveAccount(accounts[0]);
        } else {
          router.push('/login');
          return;
        }
      }

      try {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: account || instance.getAllAccounts()[0],
        });

        const graphResponse = await fetch(graphConfig.graphMeEndpoint, {
          headers: {
            Authorization: `Bearer ${response.accessToken}`,
          },
        });

        if (graphResponse.ok) {
          const data = await graphResponse.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        try {
          // Fallback to popup acquisition
          const response = await instance.acquireTokenPopup(loginRequest);
          const graphResponse = await fetch(graphConfig.graphMeEndpoint, {
            headers: {
              Authorization: `Bearer ${response.accessToken}`,
            },
          });

          if (graphResponse.ok) {
            const data = await graphResponse.json();
            setUserData(data);
          }
        } catch (error) {
          console.error('Error in fallback token acquisition:', error);
          router.push('/login');
        }
      }
    };

    fetchUserData();
  }, [instance, router]);

  const handleLogout = async () => {
    try {
      await instance.logoutPopup();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!userData) {
    return (
      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
        <Avatar className="h-10 w-10">
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={`https://avatars.dicebear.com/api/initials/${encodeURIComponent(userData.displayName || '')}.svg`} 
              alt={userData.displayName || ''} 
            />
            <AvatarFallback>{userData.displayName ? getInitials(userData.displayName) : 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userData.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData.mail || userData.userPrincipalName}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}