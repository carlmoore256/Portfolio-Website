import { NavItem, Route } from "../types";
import { sameRoute, selectRoute } from "./routes";

interface MinimalNavProps {
    navItems: NavItem[];
    routes: Route[];
    activeRoute: Route;
    navigate: (path: string) => void;
}

export function MinimalNav(props: MinimalNavProps) {
    const { navItems, navigate, routes, activeRoute } = props;
    return <div className="minimal-nav"><ul>
        {
            navItems.map((n ,i) => {
                const route = selectRoute(routes, n.path);
                if (route == null) return <></>;
                const isActive = sameRoute(route, activeRoute);
                return <li key={i}>
                    <span
                        className={isActive ? "active" : ""}
                        style={{cursor: "pointer"}}
                        onClick={() => navigate(n.path)}
                    >
                        {/* default to route label if nav link does not specify one */}
                        {n.label || route.label}
                    </span>
                </li>;
            })
        }
    </ul></div>;
}