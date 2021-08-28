import { FunctionComponent } from "react";

export interface Route {
    id: string;
    pattern: RegExp;
    label: string;
    // routes are visible in nav by default
    visibleInNav?: boolean;
    component: FunctionComponent;
}

export interface NavItem {
    path: string;
    label?: string;
}

export interface VisualArtSource {
    src: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    width: number;
    height: number;
}
