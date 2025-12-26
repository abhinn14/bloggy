"use client";

import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Input } from "./ui/input";
import { BoxSelect, Check } from "lucide-react";
import { blogCategories, useAppData } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const SideBar = () => {
  const { searchQuery, setSearchQuery, setCategory } = useAppData();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setCategory(selectedCategory);
  }, [selectedCategory, setCategory]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [localSearch, setSearchQuery]);

  return (
    <Sidebar className="w-64 border-r mt-20">
      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          {/* SEARCH */}
          <SidebarGroupLabel className="text-xs uppercase">
            Search
          </SidebarGroupLabel>

          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search blogs..."
            className="mt-2 bg-background border focus:ring-1"
          />

          {/* CATEGORIES */}
          <SidebarGroupLabel className="text-xs uppercase mt-6">
            Categories
          </SidebarGroupLabel>

          <SidebarMenu className="space-y-1">
            {["", ...blogCategories].map((cat, i) => {
              const isActive = selectedCategory === cat;
              const label = cat || "All";

              return (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "flex items-center justify-between transition-colors",
                      isActive
                        ? "bg-orange-50 text-orange-600 font-medium"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <BoxSelect size={16} />
                      <span>{label}</span>
                    </div>

                    {isActive && (
                      <Check className="w-4 h-4 text-orange-600" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;
