import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

export const Breadcrumbs: React.FC = () => {
  const { crumbs, isActive } = useBreadcrumbs();

  return (
    <div className="flex items-center text-sm text-muted-foreground">
      {crumbs.map((crumb, index) => (
        <div key={crumb.id} className="flex items-center">
          {isActive(index) ? (
            <Link to={crumb.linkTo} className="hover:underline">
              {crumb.label}
            </Link>
          ) : (
            <span>{crumb.label}</span>
          )}
          {index < crumbs.length - 1 && (
            <ChevronRight className="mx-2 h-4 w-4" />
          )}
        </div>
      ))}
    </div>
  )
}