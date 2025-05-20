export interface matchDataToSheet {
    matchId: number,
    round: number,
    Local: string,
    Visitor: string,
    result: teamPosition | undefined
}

export interface telegramChatData {
    chatId: number,
    tourplayName: string,
    meta: any,
    isAdmin: boolean
}

export interface match {
    roundNumber: number,
    matchId: number,
    scoreResume: {
        totalScoreLocal: number,
        totalScoreVisitor: number,
        winner: teamPosition
    } | undefined,
    teamLocal: teamInfo
    teamVisitor: teamInfo
}

export interface competition {
    matches: match[]
}

export interface teamInfo {
    teamName: string,
    teamRace: string,
    userNameToShow: string,
}

export interface phasesResponse {
    [competition_id: string]: {
        state: number,
        rounds: {
            roundNumber: number,
            roundProgresion: {
                totalCount: number,
                finishedCound: number
            }
            groups: {
                name: string,
                matches: {
                    matchId: number,
                    scoreResume: {
                        totalScoreLocal: number,
                        totalScoreVisitor: number,
                        winner: teamPosition
                    } | undefined,
                    rosterLocal: rosterResponse,
                    rosterVisitor: rosterResponse,
                }[]
            }[]
        }[]
    }
}

export interface rosterResponse {
    teamName: string,
    teamRace: string,
    inscription: {
        player: {
            userNameToShow: string
        }
    }
}

export interface BloodBowlVote {
    chatId: number,
    matchId: number,
    choise: teamPosition | undefined,
    date: number
}

export type teamPosition = "Local" | "Visitor"

export type HashedVotes = {
    [chatId: number]: {
        [matchId: number]: teamPosition | undefined
    }
}