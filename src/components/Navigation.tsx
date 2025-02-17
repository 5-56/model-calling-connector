
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Settings, Database } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/chat", icon: MessageSquare, label: "聊天" },
    { path: "/", icon: Settings, label: "配置" },
    { path: "/models", icon: Database, label: "模型" },
  ];

  return (
    <nav className="bg-white shadow-sm mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-8 py-4">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                "hover:bg-gray-100",
                location.pathname === path
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
