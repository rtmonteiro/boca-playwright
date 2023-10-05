import {SiteModel} from "../data/site.ts";
import {Language} from "./language.ts";

export interface Contest {
    sites: SiteModel[];
    setup: {
        id?: number;
        name: string;
        startDate: string;
        endDate: string;
        stopAnswering?: number;
        stopScoreboard?: number;
        penalty?: number;
        maxFileSize?: number;
        mainSiteUrl?: string;
        mainSiteNumber: number;
        localSiteNumber: number;
        active: boolean;
    },
    languages: Language[],
}