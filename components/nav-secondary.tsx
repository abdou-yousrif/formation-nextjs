/* "use client"

import * as React from "react"
import { Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar"
import Link from "next/link"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url} onClick={(e) => e.preventDefault()}>
                  <Link href={item.url} className="flex items-center gap-2">
                    <item.icon size={18}/>
                    <span>{item.title}</span>
                  </Link>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenu, SidebarMenuItem } from "../components/ui/sidebar";

export function NavSecondary({ items }: { items: { title: string; url: string; icon: any }[] }) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const active = pathname.startsWith(item.url);
        return (
          <SidebarMenuItem key={item.title}>
            <Link
              href={item.url}
              className={`flex items-center gap-2 px-2 py-2 rounded ${
                active ? "bg-muted-foreground/10 text-primary" : "hover:bg-muted-foreground/5"
              }`}
            >
              <item.icon size={18} />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
