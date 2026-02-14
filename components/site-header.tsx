import { Separator } from "../components/ui/separator"
import { SidebarTrigger } from "../components/ui/sidebar"
import { ThemeSelector } from "./theme-selector"
import { ModeToggle } from "./ui/mode-toggle"

export function SiteHeader() {
  return (
    <header className="
      sticky top-0 z-50 bg-background backdrop-blur supports-[backdrop-filter]:bg-background/80 
      flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] 
      ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Système de Gestion des Notes et des Évaluations Scolaires</h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeSelector />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
