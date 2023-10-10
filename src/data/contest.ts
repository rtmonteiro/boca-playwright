import {SiteModel} from "./site";
import {Language} from "../scripts/language";
import {Problem} from "../scripts/problem";

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
