import type { PhasesResponse, CompetitionBloodBowl, RosterResponse, TeamBloodBowl } from "./types";
import dataStorage from './storage';

const leagueName = process.env.NUXT_BOT_BLOODBOWL_LEAGUE || ''

export async function getCurrentFixtures(): Promise<CompetitionBloodBowl> {
    const fixturesCached = await dataStorage.getItem<{ data: CompetitionBloodBowl }>('fixtures');
    if (fixturesCached && fixturesCached.data) {
        return fixturesCached.data;
    }

    const response = await $fetch<PhasesResponse>(`https://tourplay.net/api/tournament/${leagueName}/phases?type=COACH`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en",
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "Referer": `https://tourplay.net/en/blood-bowl/${leagueName}/scores`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
    });


    const competitionInfo = responseToCompetition(response);
    dataStorage.setItem<{ data: CompetitionBloodBowl }>('fixtures', { data: competitionInfo });
    return competitionInfo;
}

export function getLeagueLink() {
    return `https://tourplay.net/en/blood-bowl/${leagueName}/scores`
}

function responseToCompetition(phaseData: PhasesResponse): CompetitionBloodBowl {
    const seasonId = Math.max(...Object.keys(phaseData).map(e => +e));
    const seasonData = phaseData[seasonId];
    let roundData = seasonData.rounds.find(round => {
        return round.roundProgresion.finishedCount === 0;
    });
    if (!roundData) {
        roundData = seasonData.rounds[seasonData.rounds.length - 1];
    }
    const groupData = roundData.groups[0];
    return {
        matches: groupData.matches.map(match => {
            return {
                roundNumber: roundData.roundNumber,
                matchId: match.matchId,
                scoreResume: undefined,
                teamLocal: teamFromResponse(match.rosterLocal),
                teamVisitor: teamFromResponse(match.rosterVisitor),
            }
        })
    }
}

function teamFromResponse(roster: RosterResponse): TeamBloodBowl {
    return {
        teamName: roster.teamName,
        teamRace: roster.teamRace,
        userNameToShow: roster.inscription.player.userNameToShow,
    }
}