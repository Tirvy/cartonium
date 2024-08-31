import { apiURL } from "./common";
import { XMLParser } from "fast-xml-parser";
import type { GameBoxDataBgg } from '~/types/frontend'

const parser = new XMLParser({
  ignoreAttributes: false,
});

function getGoodRating(poll: any[]) {
  let ratings = poll.find((item: any) => item['@_name'] === 'suggested_numplayers');
  return arrize(ratings.results).map((item: any) => {
    const results = {
      best: +item.result.find((item: any) => item['@_value'] === 'Best')["@_numvotes"],
      good: +item.result.find((item: any) => item['@_value'] === 'Recommended')["@_numvotes"],
      bad: +item.result.find((item: any) => item['@_value'] === 'Not Recommended')["@_numvotes"],
    }
    return {
      results,
      players: +item["@_numplayers"]
    }
  }).filter((item: any) => {
    return item.results.best > item.results.bad || item.results.good > item.results.bad;
  }).filter((item: any) => {
    return !!item.players
  }).map((item: any) => {
    return item.players
  })
}

function getName(obj: any): string {
  return arrize(obj.items.item.name).find((item: any) => item['@_type'] === 'primary')['@_value']
}

export default defineEventHandler(async (event): Promise<GameBoxDataBgg | null> => {
  try {
    const query = getQuery(event);
    let id = +(query.id as string);

    if (!id) {
      return null;
    }

    const res = await $fetch(`${apiURL}/thing`, { query: { id: id, stats: 1, } });
    const ret = parser.parse(res as string);

    const retObject: GameBoxDataBgg = {
      title: getName(ret),
      idBgg: +ret.items.item['@_id'],
      playersMin: +ret.items.item.minplayers['@_value'],
      playersMax: +ret.items.item.maxplayers['@_value'],
      playersGood: getGoodRating(ret.items.item.poll),
      playtimeMin: +ret.items.item.minplaytime['@_value'],
      playtimeMax: +ret.items.item.maxplaytime['@_value'],
      playtimeAvg: +ret.items.item.playingtime['@_value'],
      ratingBgg: +ret.items.item.statistics.ratings.average['@_value'],
      weightBgg: +ret.items.item.statistics.ratings.averageweight['@_value'],
      year: +ret.items.item.yearpublished['@_value'],
      linkBgg: `https://boardgamegeek.com/boardgame/${+ret.items.item['@_id']}/`,
    }
    return retObject;

  } catch (error: unknown) {
    console.log(String(error));
    if (error instanceof Error) {
      return null;
    }
  }
  return null;
});

function arrize(data: any) {
  if (Array.isArray(data)) {
    return data;
  }
  return [data];
}

// search results
/*
{
  '?xml': { '@_version': '1.0', '@_encoding': 'utf-8' },
  items: {
    item: {
      name: [Object],
      yearpublished: [Object],
      '@_type': 'boardgame',
      '@_id': '100901'
    },
    '@_total': '1',
    '@_termsofuse': 'https://boardgamegeek.com/xmlapi/termsofuse'
  }
} */



/** this request actual results:
 * {
  "?xml": {
    "@_version": "1.0",
    "@_encoding": "utf-8"
  },
  "items": {
    "item": {
      "thumbnail": "https://cf.geekdo-images.com/ljswtJbDAR_bcgSkF2PSOw__thumb/img/9_Xn-C2Z9pttuidHn4p0fr7Evgc=/fit-in/200x150/filters:strip_icc()/pic4895040.png",
      "image": "https://cf.geekdo-images.com/ljswtJbDAR_bcgSkF2PSOw__original/img/X9hrRfAd5guw5Jv06pAAmOCkrAE=/0x0/filters:format(png)/pic4895040.png",
      "name": {
        "@_type": "primary",
        "@_sortindex": "1",
        "@_value": "1817"
      },
      "description": "1817 is a railroad operations and share trading board game in the 18xx series with a distinct financial flair. It is named after the year the New York Stock Exchange opened at 40 Wall Street in New York.&#10;&#10;1817 differentiates itself from other 18xx games with its sophisticated financial mechanics that simulate the laissez faire capitalism of early America. While all the familiar mechanics of an 18xx game are present, such as placing tiles, purchasing tokens, and running trains, the game is won or lost based on the financial decisions you make.&#10;&#10;1817 includes financial mechanics seen in other 18xx games such as mergers, friendly takeovers, and conversions to different share structures. Beyond these basics, 1817 introduces several additional financial mechanics such as short selling, market driven interest rates, hostile takeovers, and corporate liquidations. The most unique is selling stock short. Short selling is the practice of selling stock you don&rsquo;t own with the intention of buying the stock back at a later date. You hope to profit from a decline in the price of the stock between the sale and the repurchase. Conversely, you will incur a loss if the price of the stock increases before the repurchase. You are also liable for dividends paid while holding the short position.&#10;&#10;",
      "yearpublished": {
        "@_value": "2010"
      },
      "minplayers": {
        "@_value": "3"
      },
      "maxplayers": {
        "@_value": "7"
      },
      "poll": [
        {
          "results": [
            {
              "result": [
                {
                  "@_value": "Best",
                  "@_numvotes": "0"
                },
                {
                  "@_value": "Recommended",
                  "@_numvotes": "0"
                },
                {
                  "@_value": "Not Recommended",
                  "@_numvotes": "13"
                }
              ],
              "@_numplayers": "1"
            },
            {
              "result": [
                {
                  "@_value": "Best",
                  "@_numvotes": "0"
                },
                {
                  "@_value": "Recommended",
                  "@_numvotes": "0"
                },
                {
                  "@_value": "Not Recommended",
                  "@_numvotes": "14"
                }
              ],
              "@_numplayers": "2"
            },
            {
              "result": [
                {
                  "@_value": "Best",
                  "@_numvotes": "1"
                },
                {
                  "@_value": "Recommended",
                  "@_numvotes": "13"
                },
                {
                  "@_value": "Not Recommended",
                  "@_numvotes": "7"
                }
              ],
              "@_numplayers": "3"
            },
            {
              "result": [
                {
                  "@_value": "Best",
                  "@_numvotes": "16"
                },
                {
                  "@_value": "Recommended",
                  "@_numvotes": "7"
                },
                {
                  "@_value": "Not Recommended",
                  "@_numvotes": "0"
                }
              ],
              "@_numplayers": "4"
            },
            {
              "result": [
                {
                  "@_value": "Best",
                  "@_numvotes": "14"
                },
                {
                  "@_value": "Recommended",
                  "@_numvotes": "7"
                },
                {
                  "@_value": "Not Recommended",
                  "@_numvotes": "0"
                }
              ],
              "@_numplayers": "5"
            },
            {
              "result": [
                {
                  "@_value": "Best",
                  "@_numvotes": "8"
                },
                {
                  "@_value": "Recommended",
                  "@_numvotes": "6"
                },
                {
                  "@_value": "Not Recommended",
                  "@_numvotes": "5"
                }
              ],
              "@_numplayers": "6"
            },
            {
              "result": [
                {
                  "@_value": "Best",
                  "@_numvotes": "2"
                },
                {
                  "@_value": "Recommended",
                  "@_numvotes": "8"
                },
                {
                  "@_value": "Not Recommended",
                  "@_numvotes": "8"
                }
              ],
              "@_numplayers": "7"
            },
            {
              "result": [
                {
                  "@_value": "Best",
                  "@_numvotes": "0"
                },
                {
                  "@_value": "Recommended",
                  "@_numvotes": "1"
                },
                {
                  "@_value": "Not Recommended",
                  "@_numvotes": "11"
                }
              ],
              "@_numplayers": "7+"
            }
          ],
          "@_name": "suggested_numplayers",
          "@_title": "User Suggested Number of Players",
          "@_totalvotes": "27"
        },
        {
          "results": {
            "result": [
              {
                "@_value": "2",
                "@_numvotes": "0"
              },
              {
                "@_value": "3",
                "@_numvotes": "0"
              },
              {
                "@_value": "4",
                "@_numvotes": "0"
              },
              {
                "@_value": "5",
                "@_numvotes": "0"
              },
              {
                "@_value": "6",
                "@_numvotes": "0"
              },
              {
                "@_value": "8",
                "@_numvotes": "0"
              },
              {
                "@_value": "10",
                "@_numvotes": "0"
              },
              {
                "@_value": "12",
                "@_numvotes": "0"
              },
              {
                "@_value": "14",
                "@_numvotes": "0"
              },
              {
                "@_value": "16",
                "@_numvotes": "2"
              },
              {
                "@_value": "18",
                "@_numvotes": "2"
              },
              {
                "@_value": "21 and up",
                "@_numvotes": "0"
              }
            ]
          },
          "@_name": "suggested_playerage",
          "@_title": "User Suggested Player Age",
          "@_totalvotes": "4"
        },
        {
          "results": {
            "result": [
              {
                "@_level": "1",
                "@_value": "No necessary in-game text",
                "@_numvotes": "1"
              },
              {
                "@_level": "2",
                "@_value": "Some necessary text - easily memorized or small crib sheet",
                "@_numvotes": "2"
              },
              {
                "@_level": "3",
                "@_value": "Moderate in-game text - needs crib sheet or paste ups",
                "@_numvotes": "0"
              },
              {
                "@_level": "4",
                "@_value": "Extensive use of text - massive conversion needed to be playable",
                "@_numvotes": "0"
              },
              {
                "@_level": "5",
                "@_value": "Unplayable in another language",
                "@_numvotes": "0"
              }
            ]
          },
          "@_name": "language_dependence",
          "@_title": "Language Dependence",
          "@_totalvotes": "3"
        }
      ],
      "playingtime": {
        "@_value": "540"
      },
      "minplaytime": {
        "@_value": "360"
      },
      "maxplaytime": {
        "@_value": "540"
      },
      "minage": {
        "@_value": "16"
      },
      "link": [
        {
          "@_type": "boardgamecategory",
          "@_id": "1021",
          "@_value": "Economic"
        },
        {
          "@_type": "boardgamecategory",
          "@_id": "1034",
          "@_value": "Trains"
        },
        {
          "@_type": "boardgamecategory",
          "@_id": "1011",
          "@_value": "Transportation"
        },
        {
          "@_type": "boardgamemechanic",
          "@_id": "2012",
          "@_value": "Auction/Bidding"
        },
        {
          "@_type": "boardgamemechanic",
          "@_id": "2904",
          "@_value": "Loans"
        },
        {
          "@_type": "boardgamemechanic",
          "@_id": "2900",
          "@_value": "Market"
        },
        {
          "@_type": "boardgamemechanic",
          "@_id": "2081",
          "@_value": "Network and Route Building"
        },
        {
          "@_type": "boardgamemechanic",
          "@_id": "2911",
          "@_value": "Ownership"
        },
        {
          "@_type": "boardgamemechanic",
          "@_id": "2005",
          "@_value": "Stock Holding"
        },
        {
          "@_type": "boardgamemechanic",
          "@_id": "2002",
          "@_value": "Tile Placement"
        },
        {
          "@_type": "boardgamemechanic",
          "@_id": "2874",
          "@_value": "Victory Points as a Resource"
        },
        {
          "@_type": "boardgamefamily",
          "@_id": "14835",
          "@_value": "Country: USA"
        },
        {
          "@_type": "boardgamefamily",
          "@_id": "70710",
          "@_value": "Digital Implementations: 18xx.games"
        },
        {
          "@_type": "boardgamefamily",
          "@_id": "19",
          "@_value": "Series: 18xx"
        },
        {
          "@_type": "boardgameexpansion",
          "@_id": "343142",
          "@_value": "18 Hiawatha"
        },
        {
          "@_type": "boardgameexpansion",
          "@_id": "396968",
          "@_value": "1817 Volatility"
        },
        {
          "@_type": "boardgameexpansion",
          "@_id": "396967",
          "@_value": "1817NA"
        },
        {
          "@_type": "boardgameexpansion",
          "@_id": "219717",
          "@_value": "18USA"
        },
        {
          "@_type": "boardgameaccessory",
          "@_id": "377248",
          "@_value": "1817: Cube4Me Loan Markers"
        },
        {
          "@_type": "boardgameaccessory",
          "@_id": "377252",
          "@_value": "1817: Cube4Me Tile Organizer Tray Stickers"
        },
        {
          "@_type": "boardgameaccessory",
          "@_id": "377251",
          "@_value": "1817: Cube4Me Tile Organizer Trays"
        },
        {
          "@_type": "boardgameaccessory",
          "@_id": "377245",
          "@_value": "1817: Cube4Me Wooden Tokens"
        },
        {
          "@_type": "boardgameaccessory",
          "@_id": "318050",
          "@_value": "1817: Seahorse Organizer"
        },
        {
          "@_type": "boardgameimplementation",
          "@_id": "346538",
          "@_value": "1877: Venezuela"
        },
        {
          "@_type": "boardgamedesigner",
          "@_id": "34669",
          "@_value": "Craig Bartell"
        },
        {
          "@_type": "boardgamedesigner",
          "@_id": "34670",
          "@_value": "Tim Flowers"
        },
        {
          "@_type": "boardgameartist",
          "@_id": "3",
          "@_value": "(Uncredited)"
        },
        {
          "@_type": "boardgamepublisher",
          "@_id": "22357",
          "@_value": "All-Aboard Games"
        },
        {
          "@_type": "boardgamepublisher",
          "@_id": "4192",
          "@_value": "Deep Thought Games, LLC"
        }
      ],
      "@_type": "boardgame",
      "@_id": "63170"
    },
    "@_termsofuse": "https://boardgamegeek.com/xmlapi/termsofuse"
  }
}
 */