import { Route } from "../types";
import { HomePage } from "../pages/HomePage";
import { MusicPage } from "../pages/MusicPage";
import { VisualArtPage } from "../pages/VisualArtPage";
import { BioPage } from "../pages/BioPage";
import { TestPage } from "../pages/TestPage";
import { PageNotFoundPage } from "../pages/PageNotFoundPage";
import { JSChallengePage } from "../pages/JSChallengePage";
import { DigitalArt } from "../pages/DigitalArt";
import { ContactPage } from "../pages/ContactPage";
import { ReactExamplesPage } from "../pages/ReactExamplesPage";

/**
 * ROUTES defines the site map, AKA all possible "pages" you can navigate to.
 * This is a single page application so the pages are just components.
 *
 * The objects in this array define how a url path resolves to a components.
 * These components display the main contents of the page.
 *
 * All "page" components are special in that they don't expect props
 * to be passed to the component. In that sense, they are standalone.
 */
export const ROUTES: Route[] = [
    {
        id: "music",
        pattern: /\/music/,
        label: "Music",
        component: MusicPage
    },
    {
        id: "visual-art",
        pattern: /\/visual-art/,
        label: "Visual Art",
        component: VisualArtPage
    },
    {
        id: "bio",
        pattern: /\/bio/,
        label: "Bio",
        component: BioPage
    },
    {
        id: "test",
        pattern: /\/test/,
        label: "Test Page",
        component: TestPage
    },
    {
        id: "js-challenges",
        pattern: /\/js-challenges/,
        label: "JS Challenges",
        component: JSChallengePage
    },
    {
        id: "digital-art",
        pattern: /\/digital-art/,
        label: "Digital Art",
        component: DigitalArt
    },
    {
        id: "contact",
        pattern: /\/contact/,
        label: "Contact",
        component: ContactPage
    },
    {
        id: "react-examples",
        pattern: /\/react-examples/,
        label: "React Examples",
        component: ReactExamplesPage
    },
    {
        id: "home",
        pattern: /\/(\?|$)/,
        label: "Home",
        component: HomePage
    },
    {
        id: "404",
        pattern: /.*/,
        label: "Page not found!",
        component: PageNotFoundPage
    }
];

export const DEFAULT_ROUTE = ROUTES.find(r => r.id === "home") as Route;

export const sameRoute = (a: Route, b: Route) => a.id === b.id;

export const selectRoute = (routes: Route[], path: string) => routes.find(r => r.pattern.test(path));