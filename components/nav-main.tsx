"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@tabler/icons-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: Icon;
    highlight: boolean;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = pathname === item.url;

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              asChild 
              isActive={isActive}
              className={cn(
                item.highlight &&
                  "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
