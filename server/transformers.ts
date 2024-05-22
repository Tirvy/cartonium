import type { ClubCollection, ClubInfo, Club, GameBox, Gathering } from '~/types/frontend.js';

// clubs
export function clubFromSupabase(data: any): Club {
    return {
        id: data.id,
        title: data.title,
        urlName: data.url_name
    };
}

// clubCollections 
export function clubCollectionFromSupabase(data: any): ClubCollection {
    return {
        clubId: data.club_id,
        gameBoxId: data.game_box_id,
        id: data.id
    };
}

// clubInfo
export function clubInfoFromSupabase(data: any): ClubInfo {
    return {
        clubId: data.club_id,
        textHtml: data.text_html
    };
}

// gameBox
export function gameBoxFromSupabase(data: any): GameBoxWithClub {
    return {
        aliasTesera: data.alias_tesera || undefined,
        id: data.id,
        idBgg: data.id_bgg || undefined,
        idTesera: data.id_tesera || undefined,
        linkBgg: data.link_bgg || undefined,
        linkTesera: data.link_tesera || undefined,
        photoUrl: data.photo_url,
        playersGood: data.players_good || undefined,
        playersMax: data.players_max || undefined,
        playersMin: data.players_min || undefined,
        playtimeAvg: data.playtime_avg || undefined,
        playtimeMax: data.playtime_max || undefined,
        playtimeMin: data.playtime_min || undefined,
        ratingBgg: data.rating_bgg || undefined,
        ratingTesera: data.rating_tesera || undefined,
        title: data.title,
        titles: data.titles,
        year: data.year || undefined,
        clubId: data.club_id || undefined,
    };
}

// gathering
export function gatheringFromSupabase(data: any): Gathering {
    return {
        clubId: data.club_id,
        commentClub: data.comment_club,
        commentOwner: data.comment_owner,
        gameboxesIds: data.gameboxes_ids,
        contact: data.contact,
        guestsMax: data.guests_max,
        id: data.id,
        owner: data.owner,
        startDate: data.start_date,
    };
}
