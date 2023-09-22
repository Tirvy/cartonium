interface GameBoxInterface  {
    infoBgg: Object | null
    infoTesera: Object | null
}

export class GameBox implements GameBoxInterface {
    infoBgg = null;
    infoTesera= null;
    constructor(value: any) {
        if (value.id) {
            //tesera
            this.infoTesera = value;
        } else {
            //bgg
            this.infoBgg = value;
        }
    };

    get computed() {
        const bgg: any = this.infoBgg || {};
        const tesera: any = this.infoTesera || {};
        return {
            title: bgg?.name?.['#text'] || tesera.title,
            photoUrl: bgg.thumbnail || tesera.photoUrl,
            ratingTesera: tesera.ratingUser,
            ratingBgg: bgg.stats?.rating?.average['@_value'],
            
        }
    }
}

/*
{
    "relationId": 93947420,
    "creationDateUtc": "2022-12-16T12:25:17",
    "game": {
        "id": 38784,
        "teseraId": 1815706,
        "title": "Kitchen Rush (Revised Edition)",
        "alias": "kitchen-rush-revised-edition",
        "descriptionShort": "Великий мир кулинарии ждет вас! Вместе со своими друзьями вы приобрели старый ресторан и теперь несете ответственность за его судьбу и успех. Используйте только лучшие ингредиенты, самые свежие травы и не позволяйте вашим гостям ждать - тогда ваш ресторан будет стремительно развиваться, и вас ждет золотое будущее!",
        "creationDateUtc": "2021-01-24T09:24:37",
        "photoUrl": "https://s.tesera.ru/images/items/1815706,3/photo1.jpg",
        "year": 2019,
        "numVotes": 9,
        "ratingUser": 9.06,
        "n10Rating": 0,
        "n20Rating": 0,
        "bggRating": 0,
        "bggGeekRating": 0,
        "bggNumVotes": 0,
        "commentsTotal": 0,
        "commentsTotalNew": 0,
        "teseraUrl": "https://tesera.ru/game/1815706",
        "isAddition": false
    }
}
{
    "name": {
        "#text": "7 Wonders Duel",
        "@_sortindex": "1"
    },
    "yearpublished": 2015,
    "image": "https://cf.geekdo-images.com/zdagMskTF7wJBPjX74XsRw__original/img/Ju836WNSaW7Mab9Vjq2TJ_FqhWQ=/0x0/filters:format(jpeg)/pic2576399.jpg",
    "thumbnail": "https://cf.geekdo-images.com/zdagMskTF7wJBPjX74XsRw__thumb/img/gV1-ckZSIC-dCxxpq1Y7GmPITzQ=/fit-in/200x150/filters:strip_icc()/pic2576399.jpg",
    "stats": {
        "rating": {
            "usersrated": {
                "@_value": "87450"
            },
            "average": {
                "@_value": "8.09793"
            },
            "bayesaverage": {
                "@_value": "7.97419"
            },
            "stddev": {
                "@_value": "1.19139"
            },
            "median": {
                "@_value": "0"
            },
            "ranks": {
                "rank": [
                    {
                        "@_type": "subtype",
                        "@_id": "1",
                        "@_name": "boardgame",
                        "@_friendlyname": "Board Game Rank",
                        "@_value": "18",
                        "@_bayesaverage": "7.97419"
                    },
                    {
                        "@_type": "family",
                        "@_id": "5497",
                        "@_name": "strategygames",
                        "@_friendlyname": "Strategy Game Rank",
                        "@_value": "21",
                        "@_bayesaverage": "7.93835"
                    }
                ]
            },
            "@_value": "8"
        },
        "@_minplayers": "2",
        "@_maxplayers": "2",
        "@_minplaytime": "30",
        "@_maxplaytime": "30",
        "@_playingtime": "30",
        "@_numowned": "143088"
    },
    "status": {
        "@_own": "0",
        "@_prevowned": "0",
        "@_fortrade": "0",
        "@_want": "0",
        "@_wanttoplay": "0",
        "@_wanttobuy": "0",
        "@_wishlist": "0",
        "@_preordered": "0",
        "@_lastmodified": "2022-06-12 16:23:50"
    },
    "numplays": 2,
    "@_objecttype": "thing",
    "@_objectid": "173346",
    "@_subtype": "boardgame",
    "@_collid": "59639712"
}*/