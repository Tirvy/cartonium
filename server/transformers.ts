import type { ClubCollection, ClubInfo, Club, GameBox, Gathering, GatheringWithGuests } from '~/types/frontend.js';

// clubs
export function clubFromSupabase(data: any, clubSettingsData: any): Club {
    return {
        id: data.id,
        title: data.title,
        urlName: data.url_name,
        themes: clubSettingsData.themes,
        avatarUrl: clubSettingsData.avatar_url,
        guestCanGatherOwn: clubSettingsData.guest_can_gather_own,
        guestCanReserve: clubSettingsData.guest_can_reserve,
        collectionSearchRating: clubSettingsData.collection_search_rating,
        collectionSearchDuration: clubSettingsData.collection_search_duration,
        collectionSearchPlayers: clubSettingsData.collection_search_players,
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
export function gameBoxToSupabase(gameBox: GameBoxWithClub): any {
    return {
        alias_tesera: gameBox.aliasTesera,
        id_bgg: gameBox.idBgg,
        id_tesera: gameBox.idTesera,
        link_bgg: gameBox.linkBgg,
        link_tesera: gameBox.linkTesera,
        photo_url: gameBox.photoUrl,
        players_good: gameBox.playersGood,
        players_max: gameBox.playersMax,
        players_min: gameBox.playersMin,
        playtime_avg: gameBox.playtimeAvg,
        playtime_max: gameBox.playtimeMax,
        playtime_min: gameBox.playtimeMin,
        rating_bgg: gameBox.ratingBgg,
        rating_tesera: gameBox.ratingTesera,
        title: gameBox.title,
        titles: gameBox.titles,
        year: gameBox.year,
    };
}

// gathering
export function gatheringFromSupabase(data: any): Gathering {
    return {
        clubId: data.club_id,
        commentClub: data.comment_club,
        commentOwner: data.comment_owner,
        gameboxId: data.gameboxes_ids,
        tableId: data.table_id,
        contact: data.contact,
        guestsMax: data.guests_max,
        id: data.id,
        ownerId: data.owner_id,
        startDate: data.start_date,
    };
}

export function gatheringWithGuestsFromSupabase(data: any): GatheringWithGuests {
    const userDataSource = data.raw_user_meta_data || data;
    const userData = {
        title: getName(userDataSource),
        imageUrl: data.avatar_url,
        messageUrl: '',
        totalGuests: data.guests_number,
        id: data.user_id,
    }

    function getName(userData: any): string {
        return userData.first_name || userData.name || userData.full_name || userData.email?.split('@')[0] || 'Unknown';
    }
    return {
        clubId: data.club_id,
        commentClub: data.comment_club,
        commentOwner: data.comment_owner,
        gameboxId: data.gamebox.id,
        gamebox: gameBoxFromSupabase(data.gamebox),
        ownTitle: data.own_name,
        tableId: data.table_id,
        contact: data.contact,
        guestsMax: data.guests_max,
        id: data.id,
        ownerId: data.owner_id,
        ownerUser: data.owneruser,
        startDate: data.start_date,
        guests: !!userData ? [userData] : [],
        slotsFilled: data.guests_number || 0,
    };

}

export function tablesFromSupabase(data: any): Table {
    return {
        id: data.id,
        clubId: data.club_id,
        title: data.title,
        description: data.description,
        peopleMax: data.people_max,
    };
}