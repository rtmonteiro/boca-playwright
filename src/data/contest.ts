import {SiteModel} from "./site.ts";
import {Language} from "../scripts/language.ts";
import {Problem} from "../scripts/problem.ts";

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
    problems: Problem[]
}