import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  apiStatus?: boolean;
  isLoading?: boolean;
}

export default function Header({ apiStatus = false, isLoading = false }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, we would toggle the theme class on the document
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-primary">Inventory Management System</h1>
          </div>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="p-2 rounded-md text-gray-500 hover:text-primary focus:outline-none"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <span className="ml-4 text-sm font-medium text-gray-500">
              API Status: {isLoading ? (
                <span className="text-yellow-500">Checking...</span>
              ) : (
                <span className={apiStatus ? "text-green-500" : "text-red-500"}>
                  {apiStatus ? "Connected" : "Disconnected"}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
