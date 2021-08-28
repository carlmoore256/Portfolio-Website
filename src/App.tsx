import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';
import { Route } from "./components/types";
import { MinimalNav } from "./components/nav/MinimalNav";
import { ROUTES, DEFAULT_ROUTE, selectRoute } from "./components/nav/routes";
import { menu as MAIN_MENU } from "./config/main-menu.json";
import { ShiftyColor } from "./model/color";

function App() {
    const [activeRoute, setActiveRoute] = useState<Route>(DEFAULT_ROUTE);

    const navItems = useMemo(() => MAIN_MENU, []);
    const routes = useMemo(() => ROUTES, []);

    // state related to the super-secure mechanism to stop fools from viewing the site
    const [secret, setSecret] = useState("");
    const [secretFeedback, setSecretFeedback] = useState("");
    const [unlocked, setUnlocked] = useState(true);

    // callback to handle "changing to a different page"
    const navigate = useCallback((path: string) => {
        // find matching route (first route with a pattern which matches path)
        const route = selectRoute(ROUTES, path) as Route;
        //  route should never be null because the home route is defined as a fallback
        // (it has a pattern which matches every string)
        console.assert(route != null, `No routes match path '${path}'!`);
        window.history.pushState({}, route.label, path);
        document.title = route.label;
        setActiveRoute(route);
    }, []);

    useEffect(() => {
        const p = `${window.location.pathname}${window.location.search}`;
        navigate(p);
    }, [navigate]);

    // dynamic background gradient fun
    useEffect(() => {
        const c1 = new ShiftyColor();
        c1.randomize();
        const c2 = new ShiftyColor();
        console.log(c1.getStyleString);
        c2.randomize();
        c1.components[3] = 0.1;
        c2.components[3] = 0.1;
        const id = setInterval(() => {
            const s1 = c1.getStyleString();
            const s2 = c2.getStyleString();
            document.body.style.backgroundImage = `linear-gradient(to bottom right, ${s1}, ${s2})`;
            c1.shift();
            c2.shift();
        }, 500);
        return () => clearInterval(id);
    }, []);

    if (!unlocked) {
        return <>
            <h4>Warning!</h4>
            <p>Turn back at once, you are not ready!</p>
            <p>If you think you are ready, riddle me this...</p>
            <p>What do you need to make steamed broccoli?</p>
            <p><b>{secretFeedback}</b></p>
            <input
                placeholder="Well, what could it be?"
                value={secret}
                onChange={event => setSecret(event.target.value)}
            />
            <button
                onClick={() => {
                    const secretLower = secret.toLowerCase().replace(/\s/g, "");
                    const correct = secretLower.includes("broccoli")
                        && secretLower.includes("water")
                        && secretLower.includes("heat");
                    const feedback = correct ? "" : "No! That is not correct!";
                    setUnlocked(correct);
                    setSecretFeedback(feedback);
                }}
            >
                GO!
            </button>
        </>;
    }

    const Content = activeRoute.component ?? React.Fragment;

    return (
        <div className="App">
            <div className="row header">
                <MinimalNav
                    navItems={navItems}
                    routes={routes}
                    activeRoute={activeRoute}
                    navigate={navigate}
                />
            </div>
            <div className="row">
                <div className="page-content">
                    <Content/>
                </div>
            </div>
        </div>
    );
}

export default App;
