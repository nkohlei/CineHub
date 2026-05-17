import { MovieRecord } from "./types";

// Complete 49-movie fallback dataset — used when the database is unavailable
export const FALLBACK_MOVIES: MovieRecord[] = [
  {
    "id": "f2",
    "title": "Schindler's List",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 424,
    "posterPath": "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    "backdropPath": "/zb6fM1CX41D9rF9hdgclu0peUmy.jpg",
    "trailerKey": "v0RB-3sWbBA",
    "rating": 8.6,
    "cast": [
      {
        "id": 3896,
        "name": "Liam Neeson",
        "character": "Oskar Schindler",
        "profile_path": "/g0iIEyt9ILiKTG0g8K69US5VtLy.jpg"
      },
      {
        "id": 2282,
        "name": "Ben Kingsley",
        "character": "Itzhak Stern",
        "profile_path": "/vQtBqpF2HDdzbfXHDzR4u37i1Ac.jpg"
      },
      {
        "id": 5469,
        "name": "Ralph Fiennes",
        "character": "Amon Goeth",
        "profile_path": "/pCnVXH1Uo2ODoOit4UXni8OD9VB.jpg"
      },
      {
        "id": 6692,
        "name": "Caroline Goodall",
        "character": "Emilie Schindler",
        "profile_path": "/4cagGtMqACvkuw6Llq8Li8UJ1AR.jpg"
      },
      {
        "id": 6693,
        "name": "Jonathan Sagall",
        "character": "Poldek Pfefferberg",
        "profile_path": "/waxNDsgfw7CXXO3LH8EdKi8z7VV.jpg"
      },
      {
        "id": 6368,
        "name": "Embeth Davidtz",
        "character": "Helen Hirsch",
        "profile_path": "/nwsdu9lOsKJ5v9RwOCc7kAiuxSO.jpg"
      }
    ],
    "imdbRating": "9.0"
  },
  {
    "id": "f3",
    "title": "Joker",
    "isWatched": true,
    "watchedAt": "2025-10-17T00:00:00Z",
    "tagColor": "green",
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 475557,
    "posterPath": "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    "backdropPath": "/hO7KbdvGOtDdeg0W4Y5nKEHeDDh.jpg",
    "trailerKey": "-RFFRxcoKfA",
    "rating": 8.1,
    "cast": [
      {
        "id": 73421,
        "name": "Joaquin Phoenix",
        "character": "Arthur Fleck",
        "profile_path": "/u38k3hQBDwNX0VA22aQceDp9Iyv.jpg"
      },
      {
        "id": 380,
        "name": "Robert De Niro",
        "character": "Murray Franklin",
        "profile_path": "/cT8htcckIuyI1Lqwt1CvD02ynTh.jpg"
      },
      {
        "id": 1545693,
        "name": "Zazie Beetz",
        "character": "Sophie Dumond",
        "profile_path": "/sgxzT54GnvgeMnOZgpQQx9csAdd.jpg"
      },
      {
        "id": 4432,
        "name": "Frances Conroy",
        "character": "Penny Fleck",
        "profile_path": "/aJRQAkO24L6bH8qkkE5Iv1nA3gf.jpg"
      },
      {
        "id": 16841,
        "name": "Brett Cullen",
        "character": "Thomas Wayne",
        "profile_path": "/4P6TsRcnr9MRbXlCdHitulGM5LT.jpg"
      },
      {
        "id": 74242,
        "name": "Shea Whigham",
        "character": "Detective Burke",
        "profile_path": "/d3caK3l4UfbnzOxv95wLoFLZzMO.jpg"
      }
    ],
    "imdbRating": "8.3"
  },
  {
    "id": "f4",
    "title": "The Gentlemen",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 522627,
    "posterPath": "/jtrhTYB7xSrJxR1vusu99nvnZ1g.jpg",
    "backdropPath": "/tintsaQ0WLzZsTMkTiqtMB3rfc8.jpg",
    "trailerKey": "KlXsguV9g0E",
    "rating": 7.7,
    "cast": [
      {
        "id": 10297,
        "name": "Matthew McConaughey",
        "character": "Michael Pearson",
        "profile_path": "/lCySuYjhXix3FzQdS4oceDDrXKI.jpg"
      },
      {
        "id": 56365,
        "name": "Charlie Hunnam",
        "character": "Ray",
        "profile_path": "/5WIDrnY25Ps2RYu0zIzHSVuSt5n.jpg"
      },
      {
        "id": 70904,
        "name": "Michelle Dockery",
        "character": "Rosalind Pearson",
        "profile_path": "/pgPJGf2wAPgoC6Bp5PBJYQV7IVt.jpg"
      },
      {
        "id": 239271,
        "name": "Jeremy Strong",
        "character": "Matthew",
        "profile_path": "/jcMhXWICSi4QjQttJVhFSiKVvpF.jpg"
      },
      {
        "id": 45753,
        "name": "Lyne Renee",
        "character": "Jackie",
        "profile_path": "/ye1ZuD2ynhrAvVXMibJSXfezTsZ.jpg"
      },
      {
        "id": 72466,
        "name": "Colin Farrell",
        "character": "Coach",
        "profile_path": "/5FdalJbrbZ5UCsED5rFrXpvbqJa.jpg"
      }
    ],
    "imdbRating": "7.8"
  },
  {
    "id": "f5",
    "title": "Goodfellas",
    "isWatched": true,
    "watchedAt": "2025-11-01T00:00:00Z",
    "tagColor": "green",
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 769,
    "posterPath": "/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg",
    "backdropPath": "/gILte6Zd7m1YneIr6MVhh30S9pr.jpg",
    "trailerKey": "PTBRNXGQR9Q",
    "rating": 8.5,
    "cast": [
      {
        "id": 380,
        "name": "Robert De Niro",
        "character": "James Conway",
        "profile_path": "/cT8htcckIuyI1Lqwt1CvD02ynTh.jpg"
      },
      {
        "id": 11477,
        "name": "Ray Liotta",
        "character": "Henry Hill",
        "profile_path": "/jdwGJbJNSRQiG2kB5MJxiu2clCQ.jpg"
      },
      {
        "id": 4517,
        "name": "Joe Pesci",
        "character": "Tommy DeVito",
        "profile_path": "/zbAdhqbMfRXSz26TjxJvB5f2eL5.jpg"
      },
      {
        "id": 11478,
        "name": "Lorraine Bracco",
        "character": "Karen Hill",
        "profile_path": "/tAtpCzN4sTOy1RHpMpJj52zTO4S.jpg"
      },
      {
        "id": 7004,
        "name": "Paul Sorvino",
        "character": "Paul Cicero",
        "profile_path": "/1gF0UskusEdDcNaBDJ2CMsz5Agi.jpg"
      },
      {
        "id": 11480,
        "name": "Frank Sivero",
        "character": "Frankie Carbone",
        "profile_path": "/eqvhj0iNtcsN6EJhd21Goqi1DSq.jpg"
      }
    ],
    "imdbRating": "8.7"
  },
  {
    "id": "f6",
    "title": "The Irishman",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 398978,
    "posterPath": "/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg",
    "backdropPath": "/1RDto0tLo8Fhq7OcwgDaM7nECb7.jpg",
    "trailerKey": "RS3aHkkfuEI",
    "rating": 7.6,
    "cast": [
      {
        "id": 380,
        "name": "Robert De Niro",
        "character": "Frank Sheeran",
        "profile_path": "/cT8htcckIuyI1Lqwt1CvD02ynTh.jpg"
      },
      {
        "id": 1158,
        "name": "Al Pacino",
        "character": "Jimmy Hoffa",
        "profile_path": "/m8HAAjq1T75JypKk0v1FFQn4ysZ.jpg"
      },
      {
        "id": 4517,
        "name": "Joe Pesci",
        "character": "Russell Bufalino",
        "profile_path": "/zbAdhqbMfRXSz26TjxJvB5f2eL5.jpg"
      },
      {
        "id": 1037,
        "name": "Harvey Keitel",
        "character": "Angelo Bruno",
        "profile_path": "/7P30hza1neYWW3r7rSQOC736K2Z.jpg"
      },
      {
        "id": 15757,
        "name": "Ray Romano",
        "character": "Bill Bufalino",
        "profile_path": "/zWT03QvuVYySlrjmHCojKrNYjoC.jpg"
      },
      {
        "id": 21127,
        "name": "Bobby Cannavale",
        "character": "Skinny Razor",
        "profile_path": "/wlp20ggyNI7x0xGUtTjC2Xl2XmD.jpg"
      }
    ],
    "imdbRating": "7.8"
  },
  {
    "id": "f7",
    "title": "American Psycho",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 1359,
    "posterPath": "/9uGHEgsiUXjCNq8wdq4r49YL8A1.jpg",
    "backdropPath": "/5oaMV2q0qzxkIW2ukU3lldLu5q2.jpg",
    "trailerKey": "81mibtQWWBg",
    "rating": 7.4,
    "cast": [
      {
        "id": 3894,
        "name": "Christian Bale",
        "character": "Patrick Bateman",
        "profile_path": "/7Pxez9J8fuPd2Mn9kex13YALrCQ.jpg"
      },
      {
        "id": 15009,
        "name": "Justin Theroux",
        "character": "Timothy Bryce",
        "profile_path": "/vnI9L0rXBAw1HeC0Q8hJGeJMGAW.jpg"
      },
      {
        "id": 6164,
        "name": "Josh Lucas",
        "character": "Craig McDermott",
        "profile_path": "/ueR4CH32f22DGjFxuhnW1o3YKB3.jpg"
      },
      {
        "id": 32029,
        "name": "Bill Sage",
        "character": "David Van Patten",
        "profile_path": "/3q2r6eDcC843GgVHVA7mSehcqC9.jpg"
      },
      {
        "id": 2838,
        "name": "Chloë Sevigny",
        "character": "Jean",
        "profile_path": "/eM7KGAMCmZCzYDFV8gaSfknN675.jpg"
      },
      {
        "id": 368,
        "name": "Reese Witherspoon",
        "character": "Evelyn Williams",
        "profile_path": "/mfjunuTHrd0wnh8UG1ImMN9FSws.jpg"
      }
    ],
    "imdbRating": "7.6"
  },
  {
    "id": "f8",
    "title": "Memento",
    "isWatched": true,
    "watchedAt": "2026-02-03T00:00:00Z",
    "tagColor": "blue",
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 77,
    "posterPath": "/fKTPH2WvH8nHTXeBYBVhawtRqtR.jpg",
    "backdropPath": "/7Wev9JMo6R5XAfz2KDvXb7oPMmy.jpg",
    "trailerKey": "Rq9eM4ZXRgs",
    "rating": 8.2,
    "cast": [
      {
        "id": 529,
        "name": "Guy Pearce",
        "character": "Leonard",
        "profile_path": "/vTqk6Nh3WgqPubkS23eOlMAwmwa.jpg"
      },
      {
        "id": 530,
        "name": "Carrie-Anne Moss",
        "character": "Natalie",
        "profile_path": "/xD4jTA3KmVp5Rq3aHcymL9DUGjD.jpg"
      },
      {
        "id": 532,
        "name": "Joe Pantoliano",
        "character": "Teddy",
        "profile_path": "/3OHUI3nX4SYGGItDk3xqeIvWtIf.jpg"
      },
      {
        "id": 534,
        "name": "Mark Boone Junior",
        "character": "Burt",
        "profile_path": "/rcncVr356hpfKX9qOrKL3SJlEO7.jpg"
      },
      {
        "id": 535,
        "name": "Russ Fega",
        "character": "Waiter",
        "profile_path": "/d0W7kq97Ul8Iz5LZIVNDKxSly8M.jpg"
      },
      {
        "id": 536,
        "name": "Jorja Fox",
        "character": "Leonard's Wife",
        "profile_path": "/hCRdbNzZjkhYyVoZPmhYF5OqpaX.jpg"
      }
    ],
    "imdbRating": "8.4"
  },
  {
    "id": "f9",
    "title": "The Godfather / TG Part 2",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 238,
    "posterPath": "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    "backdropPath": "/tSPT36ZKlP2WVHJLM4cQPLSzv3b.jpg",
    "trailerKey": "Ew9ngL1GZvs",
    "rating": 8.7,
    "cast": [
      {
        "id": 3084,
        "name": "Marlon Brando",
        "character": "Don Vito Corleone",
        "profile_path": "/eEHCjqKMWSvQU4bmwhLMsg4RtEr.jpg"
      },
      {
        "id": 1158,
        "name": "Al Pacino",
        "character": "Michael Corleone",
        "profile_path": "/m8HAAjq1T75JypKk0v1FFQn4ysZ.jpg"
      },
      {
        "id": 3085,
        "name": "James Caan",
        "character": "Sonny Corleone",
        "profile_path": "/z2Lz3rtxZ7aJjzBUkCnExvo8stn.jpg"
      },
      {
        "id": 3087,
        "name": "Robert Duvall",
        "character": "Tom Hagen",
        "profile_path": "/3tcKxC5Sc3DJ6XPDKKC2EAomEWn.jpg"
      },
      {
        "id": 3086,
        "name": "Richard S. Castellano",
        "character": "Clemenza",
        "profile_path": "/1vr75BdHWret81vuSJ3ugiCBkxw.jpg"
      },
      {
        "id": 3092,
        "name": "Diane Keaton",
        "character": "Kay Adams",
        "profile_path": "/A8B3BsFgbmw2WEmJuQX38qeU9eR.jpg"
      }
    ],
    "imdbRating": "9.2"
  },
  {
    "id": "f10",
    "title": "Pulp Fiction / Ucuz Roman",
    "isWatched": true,
    "watchedAt": "2026-01-30T00:00:00Z",
    "tagColor": "yellow",
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 680,
    "posterPath": "/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg",
    "backdropPath": "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    "trailerKey": "tGpTpVyI_OQ",
    "rating": 8.5,
    "cast": [
      {
        "id": 8891,
        "name": "John Travolta",
        "character": "Vincent Vega",
        "profile_path": "/ap8eEYfBKTLixmVVpRlq4NslDD5.jpg"
      },
      {
        "id": 2231,
        "name": "Samuel L. Jackson",
        "character": "Jules Winnfield",
        "profile_path": "/AiAYAqwpM5xmiFrAIeQvUXDCVvo.jpg"
      },
      {
        "id": 139,
        "name": "Uma Thurman",
        "character": "Mia Wallace",
        "profile_path": "/sBgAZWi3o4FsnaTvnTNtK6jpQcF.jpg"
      },
      {
        "id": 62,
        "name": "Bruce Willis",
        "character": "Butch Coolidge",
        "profile_path": "/w3aXr1e7gQCn8MSp1vW4sXHn99P.jpg"
      },
      {
        "id": 10182,
        "name": "Ving Rhames",
        "character": "Marsellus Wallace",
        "profile_path": "/tOVDvu1EQP78AwaUw6uh1wN818E.jpg"
      },
      {
        "id": 1037,
        "name": "Harvey Keitel",
        "character": "The Wolf",
        "profile_path": "/7P30hza1neYWW3r7rSQOC736K2Z.jpg"
      }
    ],
    "imdbRating": "8.8"
  },
  {
    "id": "f11",
    "title": "Machinist",
    "isWatched": true,
    "watchedAt": "2026-05-02T00:00:00Z",
    "tagColor": "green",
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 4553,
    "posterPath": "/diAYqR4xdF9Hnj7qun6DEQhRrT2.jpg",
    "backdropPath": "/hi3lxLd93iKwCmVAfhMV9m1k2jr.jpg",
    "trailerKey": "7HPT9006wT8",
    "rating": 7.5,
    "cast": [
      {
        "id": 3894,
        "name": "Christian Bale",
        "character": "Trevor Reznik",
        "profile_path": "/7Pxez9J8fuPd2Mn9kex13YALrCQ.jpg"
      },
      {
        "id": 10431,
        "name": "Jennifer Jason Leigh",
        "character": "Stevie",
        "profile_path": "/9nT2mbQ9P8UpCXirssDxDT75jlm.jpg"
      },
      {
        "id": 37946,
        "name": "Aitana Sánchez-Gijón",
        "character": "Marie",
        "profile_path": "/4gm7EJzvJQbN2RPW1ZOcEzF1jDn.jpg"
      },
      {
        "id": 36900,
        "name": "John Sharian",
        "character": "Ivan",
        "profile_path": "/kyt5wb9ID7G4Kz07ikvduBDH5QB.jpg"
      },
      {
        "id": 11086,
        "name": "Michael Ironside",
        "character": "Miller",
        "profile_path": "/mzHmxtKcMJjDqWxKd67mKQJFW1B.jpg"
      },
      {
        "id": 37947,
        "name": "Lawrence Gilliard Jr.",
        "character": "Jackson",
        "profile_path": "/1b0oIuPOwJoRWpmF96IOxwmkpDw.jpg"
      }
    ],
    "imdbRating": "7.6"
  },
  {
    "id": "f12",
    "title": "Gladiator / G 2",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 98,
    "posterPath": "/wN2xWp1eIwCKOD0BHTcErTBv1Uq.jpg",
    "backdropPath": "/jhk6D8pim3yaByu1801kMoxXFaX.jpg",
    "trailerKey": "P5ieIbInFpg",
    "rating": 8.2,
    "cast": [
      {
        "id": 934,
        "name": "Russell Crowe",
        "character": "Maximus",
        "profile_path": "/uxiXuVH4vNWrKlJMVVPG1sxAJFe.jpg"
      },
      {
        "id": 73421,
        "name": "Joaquin Phoenix",
        "character": "Commodus",
        "profile_path": "/u38k3hQBDwNX0VA22aQceDp9Iyv.jpg"
      },
      {
        "id": 935,
        "name": "Connie Nielsen",
        "character": "Lucilla",
        "profile_path": "/gSQ3O3PJ6ly6nT63joOtfZyscFP.jpg"
      },
      {
        "id": 936,
        "name": "Oliver Reed",
        "character": "Proximo",
        "profile_path": "/dWfotc1X71wNCGyPO9hXpv8U9Gw.jpg"
      },
      {
        "id": 194,
        "name": "Richard Harris",
        "character": "Marcus Aurelius",
        "profile_path": "/lCvcVMuxrg1f5A8OMqY9AqkkcZR.jpg"
      },
      {
        "id": 937,
        "name": "Derek Jacobi",
        "character": "Gracchus",
        "profile_path": "/yHENzHZSVpnNrqsoATuDSMiQflf.jpg"
      }
    ],
    "imdbRating": "8.5"
  },
  {
    "id": "f13",
    "title": "Donnie Brasco / Köstebek",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 9366,
    "posterPath": "/xtKLvpOfARi1XVm8u2FTdhY5Piq.jpg",
    "backdropPath": "/7aWpb0sfGteTomS9DP5NWDeD7DL.jpg",
    "trailerKey": "TDWkpydv51k",
    "rating": 7.5,
    "cast": [
      {
        "id": 85,
        "name": "Johnny Depp",
        "character": "Donnie Brasco / Joseph D. 'Joe' Pistone",
        "profile_path": "/k2xt6EUxQDwYRKIyI4IBdZxfs8n.jpg"
      },
      {
        "id": 1158,
        "name": "Al Pacino",
        "character": "Benjamin 'Lefty' Ruggiero",
        "profile_path": "/m8HAAjq1T75JypKk0v1FFQn4ysZ.jpg"
      },
      {
        "id": 147,
        "name": "Michael Madsen",
        "character": "Dominick 'Sonny Black' Napolitano",
        "profile_path": "/fvr2EXEPrVwsF2JlfRp0Olbj4g8.jpg"
      },
      {
        "id": 9257,
        "name": "Bruno Kirby",
        "character": "Nicholas 'Nicky' Santora",
        "profile_path": "/rCYOMk34rqf28KusLKi002RNbFg.jpg"
      },
      {
        "id": 785,
        "name": "James Russo",
        "character": "Paulie",
        "profile_path": "/nubhNb5OUkzsrndD1BNqzp7MGyo.jpg"
      },
      {
        "id": 8256,
        "name": "Anne Heche",
        "character": "Maggie Pistone",
        "profile_path": "/65LVuA01bmKCmr8yqY2Ae3IgeC4.jpg"
      }
    ],
    "imdbRating": "7.7"
  },
  {
    "id": "f14",
    "title": "Demolition / Yeniden Başla",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 303991,
    "posterPath": "/4t56LZ1KbOOxgKfqMKN6truBDVc.jpg",
    "backdropPath": "/dapUorbOMzlaB12dACCtaiuaTQz.jpg",
    "trailerKey": "3UnSXelOJo0",
    "rating": 6.8,
    "cast": [
      {
        "id": 131,
        "name": "Jake Gyllenhaal",
        "character": "Davis Mitchell",
        "profile_path": "/rJdYHYNhlcOBwbPvDZVvt1xw7bi.jpg"
      },
      {
        "id": 3489,
        "name": "Naomi Watts",
        "character": "Karen Moreno",
        "profile_path": "/mwel3q2EK4VZEZYur65kEYnzqsH.jpg"
      },
      {
        "id": 2955,
        "name": "Chris Cooper",
        "character": "Phil Eastwood",
        "profile_path": "/j0sQDzaDlnNAdaYhy6HRRAFi22.jpg"
      },
      {
        "id": 1538780,
        "name": "Judah Lewis",
        "character": "Chris Moreno",
        "profile_path": "/ekyNhCu18vYgJjt8MHrS9KsOqtD.jpg"
      },
      {
        "id": 1363367,
        "name": "C.J. Wilson",
        "character": "Carl",
        "profile_path": "/4qoB1VuVQ7m3MtcL3iRIZiXN39H.jpg"
      },
      {
        "id": 114470,
        "name": "Polly Draper",
        "character": "Margot Eastwood",
        "profile_path": "/iMLGOq79b9w3eErmwQSPoSREsUa.jpg"
      }
    ],
    "imdbRating": "7.0"
  },
  {
    "id": "f15",
    "title": "The Lighthouse / Deniz Feneri",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 503919,
    "posterPath": "/f1tIYarTbkBdIT1aW0gzelDwknv.jpg",
    "backdropPath": "/sYLzRuEcwSz0L1Z92wQNrETHU9O.jpg",
    "trailerKey": "42_UHhpq530",
    "rating": 7.5,
    "cast": [
      {
        "id": 11288,
        "name": "Robert Pattinson",
        "character": "Thomas Howard",
        "profile_path": "/3qZ09UE7lN6AtorfXFRYpEtSY93.jpg"
      },
      {
        "id": 5293,
        "name": "Willem Dafoe",
        "character": "Thomas Wake",
        "profile_path": "/ui8e4sgZAwMPi3hzEO53jyBJF9B.jpg"
      },
      {
        "id": 2309944,
        "name": "Valeriia Karaman",
        "character": "Mermaid",
        "profile_path": "/oHmoNWljO6Qgx9az6cPyO5OXnpJ.jpg"
      },
      {
        "id": 2507696,
        "name": "Logan Hawkes",
        "character": "Ephraim Winslow",
        "profile_path": "/8Ai8dFBOlobC6mFLLNleyfhL20d.jpg"
      },
      {
        "id": 2507697,
        "name": "Kyla Nicolle",
        "character": "Woman on the Rocks",
        "profile_path": "/w1k0Nw8tZC6WUOlvE51H808qW7M.jpg"
      },
      {
        "id": 1520954,
        "name": "Shaun Clarke",
        "character": "Departing Wickie",
        "profile_path": null
      }
    ],
    "imdbRating": "7.4"
  },
  {
    "id": "f16",
    "title": "The Lord of The Rings Series",
    "isWatched": true,
    "watchedAt": "2025-10-30T00:00:00Z",
    "tagColor": "blue",
    "tmdbId": 120,
    "createdAt": "2025-01-01T00:00:00Z",
    "posterPath": "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    "backdropPath": "/a0lfia8tk8ifkrve0Tn8wkISUvs.jpg",
    "trailerKey": "_nZdmwHrcnw",
    "rating": 8.4,
    "imdbRating": "8.9",
    "cast": [
      {
        "id": 109,
        "name": "Elijah Wood",
        "character": "Frodo",
        "profile_path": "/ayARmqAe9Aab1zg6FjJG0u9MEBo.jpg"
      },
      {
        "id": 1327,
        "name": "Ian McKellen",
        "character": "Gandalf",
        "profile_path": "/coWjgMEYJjk2OrNddlXCBm8EIr3.jpg"
      },
      {
        "id": 110,
        "name": "Viggo Mortensen",
        "character": "Aragorn",
        "profile_path": "/vH5gVSpHAMhDaFWfh0Q7BG61O1y.jpg"
      },
      {
        "id": 1328,
        "name": "Sean Astin",
        "character": "Sam",
        "profile_path": "/As3ctGUtBYmG4zj4Ifyrcqd71HP.jpg"
      },
      {
        "id": 65,
        "name": "Ian Holm",
        "character": "Bilbo",
        "profile_path": "/cOJDgvgj4nMec6Inzj1H5nugTO5.jpg"
      },
      {
        "id": 882,
        "name": "Liv Tyler",
        "character": "Arwen",
        "profile_path": "/aYlqS4wYuNCiN9wmvDwKRAE9BQ9.jpg"
      }
    ]
  },
  {
    "id": "f17",
    "title": "The Pianist",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 423,
    "posterPath": "/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg",
    "backdropPath": "/c0fB9xk7D1aVb3Bg2rk2SVJcGn.jpg",
    "trailerKey": "og9hFxxdSOg",
    "rating": 8.4,
    "cast": [
      {
        "id": 3490,
        "name": "Adrien Brody",
        "character": "Władysław 'Władek' Szpilman",
        "profile_path": "/id5GuTduKt3yCwb7BrVLuWKqaSq.jpg"
      },
      {
        "id": 3491,
        "name": "Thomas Kretschmann",
        "character": "Captain Wilm Hosenfeld",
        "profile_path": "/kBnPu1KREhckuPpnAUppm24kkVX.jpg"
      },
      {
        "id": 6637,
        "name": "Frank Finlay",
        "character": "Father",
        "profile_path": "/fO7CYAaGydu9d3s5numYRi1BRvL.jpg"
      },
      {
        "id": 6638,
        "name": "Maureen Lipman",
        "character": "Mother",
        "profile_path": "/kx26NOAw9GnsHjJIJ4l40YHblJ.jpg"
      },
      {
        "id": 6639,
        "name": "Emilia Fox",
        "character": "Dorota",
        "profile_path": "/lZpNRsHAOW8m0f7bRfgUDmRRjo.jpg"
      },
      {
        "id": 6640,
        "name": "Ed Stoppard",
        "character": "Henryk Szpilman",
        "profile_path": "/jnLSiFipp0K5ROJblLCISC7ezzO.jpg"
      }
    ],
    "imdbRating": "8.5"
  },
  {
    "id": "f18",
    "title": "The Grand Budapest Hotel",
    "isWatched": true,
    "watchedAt": "2026-03-02T00:00:00Z",
    "tagColor": "blue",
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 120467,
    "posterPath": "/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
    "backdropPath": "/9udCLTxTFl28RxnK8Q05E154ZGa.jpg",
    "trailerKey": "G1jG8HUY4zI",
    "rating": 8,
    "cast": [
      {
        "id": 5469,
        "name": "Ralph Fiennes",
        "character": "M. Gustave",
        "profile_path": "/pCnVXH1Uo2ODoOit4UXni8OD9VB.jpg"
      },
      {
        "id": 1164,
        "name": "F. Murray Abraham",
        "character": "Mr. Moustafa",
        "profile_path": "/p2RYVGdrcP0m70BkkiKcwyrDeim.jpg"
      },
      {
        "id": 8789,
        "name": "Mathieu Amalric",
        "character": "Serge X.",
        "profile_path": "/fMhfoTbjlXQy2Iojp7oYx49hLQl.jpg"
      },
      {
        "id": 3490,
        "name": "Adrien Brody",
        "character": "Dmitri",
        "profile_path": "/id5GuTduKt3yCwb7BrVLuWKqaSq.jpg"
      },
      {
        "id": 5293,
        "name": "Willem Dafoe",
        "character": "Jopling",
        "profile_path": "/ui8e4sgZAwMPi3hzEO53jyBJF9B.jpg"
      },
      {
        "id": 4785,
        "name": "Jeff Goldblum",
        "character": "Deputy Kovacs",
        "profile_path": "/kcyEPgYtBP5Pm6LLeLGfXKjYovL.jpg"
      }
    ],
    "imdbRating": "8.1"
  },
  {
    "id": "f19",
    "title": "Parasite",
    "isWatched": true,
    "watchedAt": "2025-10-27T00:00:00Z",
    "tagColor": "blue",
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 496243,
    "posterPath": "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    "backdropPath": "/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
    "trailerKey": "bM9QabAojCg",
    "rating": 8.5,
    "cast": [
      {
        "id": 20738,
        "name": "Song Kang-ho",
        "character": "Kim Ki-taek",
        "profile_path": "/kBM9UTPYXUA2RNk210DXhztLFns.jpg"
      },
      {
        "id": 115290,
        "name": "Lee Sun-kyun",
        "character": "Park Dong-ik",
        "profile_path": "/nHFBbSFohzOUOvMxPVwe3Es2nJw.jpg"
      },
      {
        "id": 556435,
        "name": "Cho Yeo-jeong",
        "character": "Yeon-kyo",
        "profile_path": "/5MgWM8pkUiYkj9MEaEpO0Ir1FD9.jpg"
      },
      {
        "id": 1255881,
        "name": "Choi Woo-shik",
        "character": "Ki-woo",
        "profile_path": "/hRDiuKWwe156zRjEu826eci7H3r.jpg"
      },
      {
        "id": 1442583,
        "name": "Park So-dam",
        "character": "Ki-jung",
        "profile_path": "/fGVOikpvivopeATDy6ZzLdKYXDu.jpg"
      },
      {
        "id": 1572354,
        "name": "Lee Jung-eun",
        "character": "Moon-gwang",
        "profile_path": "/4r3K47UpSmzZ5t9cyTRRqRl9rdz.jpg"
      }
    ],
    "imdbRating": "8.5"
  },
  {
    "id": "f20",
    "title": "Superbad",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 8363,
    "posterPath": "/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg",
    "backdropPath": "/coru98UcFBzJIU7bxZguxaePgu0.jpg",
    "trailerKey": "MuhWxdD0qno",
    "rating": 7.3,
    "cast": [
      {
        "id": 21007,
        "name": "Jonah Hill",
        "character": "Seth",
        "profile_path": "/cymlWttB83MsAGR2EkTgANtjeRH.jpg"
      },
      {
        "id": 39995,
        "name": "Michael Cera",
        "character": "Evan",
        "profile_path": "/lFKyW2C7xj7X4nWpOEbVIDGOKrH.jpg"
      },
      {
        "id": 54691,
        "name": "Christopher Mintz-Plasse",
        "character": "Fogell",
        "profile_path": "/dnj2qyxmPt5JF5uurbXQLegppAx.jpg"
      },
      {
        "id": 19278,
        "name": "Bill Hader",
        "character": "Officer Slater",
        "profile_path": "/qyT50vQ9PQIEctE1IxDTEsBKstU.jpg"
      },
      {
        "id": 19274,
        "name": "Seth Rogen",
        "character": "Officer Michaels",
        "profile_path": "/nYl9bvQzaPQLzlf0wf75clLN6Hi.jpg"
      },
      {
        "id": 54692,
        "name": "Martha MacIsaac",
        "character": "Becca",
        "profile_path": "/bRTzhnXKkHYwuPSfsDvidDJeHpu.jpg"
      }
    ],
    "imdbRating": "7.6"
  },
  {
    "id": "f21",
    "title": "Get out",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 419430,
    "posterPath": "/mE24wUCfjK8AoBBjaMjho7Rczr7.jpg",
    "backdropPath": "/o8dPH0ZSIyyViP6rjRX1djwCUwI.jpg",
    "trailerKey": "gsB70ZRY-hI",
    "rating": 7.6,
    "cast": [
      {
        "id": 206919,
        "name": "Daniel Kaluuya",
        "character": "Chris Washington",
        "profile_path": "/jj2kZqJobjom36wlhlYhc38nTwN.jpg"
      },
      {
        "id": 1255540,
        "name": "Allison Williams",
        "character": "Rose Armitage",
        "profile_path": "/5Jy9HELKS1OYg7moRl8870OSfJq.jpg"
      },
      {
        "id": 2229,
        "name": "Catherine Keener",
        "character": "Missy Armitage",
        "profile_path": "/n4CTwGszs6cwS1wJRlDQ5Mlh7Ex.jpg"
      },
      {
        "id": 11367,
        "name": "Bradley Whitford",
        "character": "Dean Armitage",
        "profile_path": "/oeDv2qZWTxELLaNtOIoeG72leNY.jpg"
      },
      {
        "id": 572541,
        "name": "Caleb Landry Jones",
        "character": "Jeremy Armitage",
        "profile_path": "/8M5lPHrERwAIfWK56RkH30FOjhV.jpg"
      },
      {
        "id": 1291961,
        "name": "Marcus Henderson",
        "character": "Walter",
        "profile_path": "/vTevIy7GKjhmpoAhoayifnwqgn2.jpg"
      }
    ],
    "imdbRating": "7.8"
  },
  {
    "id": "f22",
    "title": "No Country for Old Men / İhtiyarlara Yer Yok",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 6977,
    "posterPath": "/6d5XOczc226jECq0LIX0siKtgHR.jpg",
    "backdropPath": "/gddUsvfyySrM5k8B8wwJy2VRlBx.jpg",
    "trailerKey": "A0oNrgumrlE",
    "rating": 7.9,
    "cast": [
      {
        "id": 3810,
        "name": "Javier Bardem",
        "character": "Anton Chigurh",
        "profile_path": "/dKArLTzGUBqRwV6MI3Atc1xN9bc.jpg"
      },
      {
        "id": 2176,
        "name": "Tommy Lee Jones",
        "character": "Ed Tom Bell",
        "profile_path": "/mCiZNRAzbnPojJEZwVZWLw9kzxR.jpg"
      },
      {
        "id": 16851,
        "name": "Josh Brolin",
        "character": "Llewelyn Moss",
        "profile_path": "/sX2etBbIkxRaCsATyw5ZpOVMPTD.jpg"
      },
      {
        "id": 57755,
        "name": "Woody Harrelson",
        "character": "Carson Wells",
        "profile_path": "/igxYDQBbTEdAqaJxaW6ffqswmUU.jpg"
      },
      {
        "id": 9015,
        "name": "Kelly Macdonald",
        "character": "Carla Jean Moss",
        "profile_path": "/k0yVocTnTMWlNdaeOO7YRViCdhO.jpg"
      },
      {
        "id": 39520,
        "name": "Garret Dillahunt",
        "character": "Wendell",
        "profile_path": "/4L9bdqQIdfrtqR7JQdsIhlF3Fjk.jpg"
      }
    ],
    "imdbRating": "8.2"
  },
  {
    "id": "f23",
    "title": "Kingdom of Heaven / Cennetin Krallığı",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 1495,
    "posterPath": "/rNaBe4TwbMef71sgscqabpGKsxh.jpg",
    "backdropPath": "/kP8rK9dGS1pr0HrnmXfIi2heWjo.jpg",
    "trailerKey": "6Z2wGCZ2fSM",
    "rating": 7,
    "cast": [
      {
        "id": 114,
        "name": "Orlando Bloom",
        "character": "Balian de Ibelin",
        "profile_path": "/lwQoA0qJTCZ6l2FH6PjmhRQjiaB.jpg"
      },
      {
        "id": 10912,
        "name": "Eva Green",
        "character": "Sibylla",
        "profile_path": "/8MqXy7Jd6HsRSBFK05J0KrR2x5Z.jpg"
      },
      {
        "id": 16940,
        "name": "Jeremy Irons",
        "character": "Tiberias",
        "profile_path": "/w8Ct1q02Ht3sWdOSqfp3B85TzT.jpg"
      },
      {
        "id": 11207,
        "name": "David Thewlis",
        "character": "Hospitaler",
        "profile_path": "/sNuYyT8ocLlQr3TdAW9CoKVbCU8.jpg"
      },
      {
        "id": 70577,
        "name": "Ghassan Massoud",
        "character": "Saladin",
        "profile_path": "/d02DsjfBcbZctPCUrRxS0vWbpk7.jpg"
      },
      {
        "id": 3896,
        "name": "Liam Neeson",
        "character": "Godfrey de Ibelin",
        "profile_path": "/g0iIEyt9ILiKTG0g8K69US5VtLy.jpg"
      }
    ],
    "imdbRating": "7.3"
  },
  {
    "id": "f24",
    "title": "Zodiac",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 1949,
    "posterPath": "/6YmeO4pB7XTh8P8F960O1uA14JO.jpg",
    "backdropPath": "/3zCPI4JFc54xvLaJ71oI2KoP3az.jpg",
    "trailerKey": "yNncHPl1UXg",
    "rating": 7.5,
    "cast": [
      {
        "id": 131,
        "name": "Jake Gyllenhaal",
        "character": "Robert Graysmith",
        "profile_path": "/rJdYHYNhlcOBwbPvDZVvt1xw7bi.jpg"
      },
      {
        "id": 103,
        "name": "Mark Ruffalo",
        "character": "David Toschi",
        "profile_path": "/5GilHMOt5PAQh6rlUKZzGmaKEI7.jpg"
      },
      {
        "id": 11085,
        "name": "Anthony Edwards",
        "character": "William Armstrong",
        "profile_path": "/rP88gP87pa3je6Viem3081tESIV.jpg"
      },
      {
        "id": 3223,
        "name": "Robert Downey Jr.",
        "character": "Paul Avery",
        "profile_path": "/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg"
      },
      {
        "id": 2838,
        "name": "Chloë Sevigny",
        "character": "Melanie",
        "profile_path": "/eM7KGAMCmZCzYDFV8gaSfknN675.jpg"
      },
      {
        "id": 13550,
        "name": "Elias Koteas",
        "character": "Jack Mulanax",
        "profile_path": "/luevjlGy0tYQbAbcz0mVxCYqegH.jpg"
      }
    ],
    "imdbRating": "7.7"
  },
  {
    "id": "f25",
    "title": "Django",
    "isWatched": true,
    "watchedAt": "2025-11-07T00:00:00Z",
    "tagColor": "blue",
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 68718,
    "posterPath": "/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg",
    "backdropPath": "/2oZklIzUbvZXXzIFzv7Hi68d6xf.jpg",
    "trailerKey": "_iH0UBYDI4g",
    "rating": 8.2,
    "cast": [
      {
        "id": 134,
        "name": "Jamie Foxx",
        "character": "Django Freeman",
        "profile_path": "/25zzvFA6yx2Q9BYnugsbd4JWDfu.jpg"
      },
      {
        "id": 27319,
        "name": "Christoph Waltz",
        "character": "Dr. King Schultz",
        "profile_path": "/jMvLGCVXLaBqjRLf5olyvEucZob.jpg"
      },
      {
        "id": 6193,
        "name": "Leonardo DiCaprio",
        "character": "Calvin J. Candie",
        "profile_path": "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg"
      },
      {
        "id": 11703,
        "name": "Kerry Washington",
        "character": "Broomhilda von Shaft",
        "profile_path": "/h50ibjjpR9lF566PHoV7u7CuWGY.jpg"
      },
      {
        "id": 2231,
        "name": "Samuel L. Jackson",
        "character": "Stephen",
        "profile_path": "/AiAYAqwpM5xmiFrAIeQvUXDCVvo.jpg"
      },
      {
        "id": 27740,
        "name": "Walton Goggins",
        "character": "Billy Crash",
        "profile_path": "/5lcVMJbWrNDFiWa1WxK4oR8zwev.jpg"
      }
    ],
    "imdbRating": "8.5"
  },
  {
    "id": "f26",
    "title": "The Good, The Bad and The Ugly",
    "isWatched": true,
    "watchedAt": "2026-01-21T00:00:00Z",
    "tagColor": "blue",
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 429,
    "posterPath": "/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg",
    "backdropPath": "/Adrip2Jqzw56KeuV2nAxucKMNXA.jpg",
    "trailerKey": "WCnRSl24FPA",
    "rating": 8.5,
    "cast": [
      {
        "id": 190,
        "name": "Clint Eastwood",
        "character": "Blondie",
        "profile_path": "/8TwdCfeOZH7ucRlfLZ6wObxa7cO.jpg"
      },
      {
        "id": 3265,
        "name": "Eli Wallach",
        "character": "Tuco Ramirez",
        "profile_path": "/egLe8r2PwbTx9ocwS1Zu2vsYC9v.jpg"
      },
      {
        "id": 4078,
        "name": "Lee Van Cleef",
        "character": "Sentenza / Angel Eyes",
        "profile_path": "/yQc5wjNCdRZzPp5E2wRPRYsEq9a.jpg"
      },
      {
        "id": 5813,
        "name": "Aldo Giuffrè",
        "character": "Alcoholic Union Captain",
        "profile_path": "/aT6eECl1R3YGYL4KatyIQrq0zG8.jpg"
      },
      {
        "id": 5814,
        "name": "Luigi Pistilli",
        "character": "Father Pablo Ramirez",
        "profile_path": "/bH5vmD2CMBHzJyBe0P0bL6iTUNL.jpg"
      },
      {
        "id": 5815,
        "name": "Rada Rassimov",
        "character": "Maria",
        "profile_path": "/xJhnSHn2vKp0MJ2KZaihrgqq0Mc.jpg"
      }
    ],
    "imdbRating": "8.8"
  },
  {
    "id": "f27",
    "title": "Forrest Gump",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 13,
    "posterPath": "/Cw4hIUIAmSYfK9QfaUW5igp9La.jpg",
    "backdropPath": "/ghgfzbEV7kbpbi1O8eIILKVXEA8.jpg",
    "trailerKey": "Mj9IA9tTfio",
    "rating": 8.5,
    "cast": [
      {
        "id": 31,
        "name": "Tom Hanks",
        "character": "Forrest Gump",
        "profile_path": "/oFvZoKI6lvU03n4YoNGAll9rkas.jpg"
      },
      {
        "id": 32,
        "name": "Robin Wright",
        "character": "Jenny Curran",
        "profile_path": "/d3rIv0y2p0jMsQ7ViR7O1606NZa.jpg"
      },
      {
        "id": 33,
        "name": "Gary Sinise",
        "character": "Lieutenant Dan Taylor",
        "profile_path": "/olRjiV8ZhBixQiTvrGwXhpVXxsV.jpg"
      },
      {
        "id": 35,
        "name": "Sally Field",
        "character": "Mrs. Gump",
        "profile_path": "/iMeq1j9Xwvaf6PbTJ0FQz69fpuA.jpg"
      },
      {
        "id": 34,
        "name": "Mykelti Williamson",
        "character": "Bubba Blue",
        "profile_path": "/dR16zD9AjnHWbeN5OVmJWE0vSax.jpg"
      },
      {
        "id": 37821,
        "name": "Michael Conner Humphreys",
        "character": "Young Forrest Gump",
        "profile_path": "/irYRs3COggVHg91jL3CrlCIWmnx.jpg"
      }
    ],
    "imdbRating": "8.8"
  },
  {
    "id": "f28",
    "title": "The Theory of Everything",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 266856,
    "posterPath": "/7kwcLFNt887saoQAL7EY0XnW7VI.jpg",
    "backdropPath": "/dh2QT3TPtAQf057yeLpNMuaJlmp.jpg",
    "trailerKey": "_EnhOKk7BxM",
    "rating": 7.8,
    "cast": [
      {
        "id": 37632,
        "name": "Eddie Redmayne",
        "character": "Stephen Hawking",
        "profile_path": "/fSvG7qzoBBnJUmgtIuMgrK3EQPN.jpg"
      },
      {
        "id": 72855,
        "name": "Felicity Jones",
        "character": "Jane Hawking",
        "profile_path": "/fyhWRmxpTEYl5d8DnkIo6i8RdWJ.jpg"
      },
      {
        "id": 23458,
        "name": "Charlie Cox",
        "character": "Jonathan Hellyer Jones",
        "profile_path": "/jBHDZ8MA4I7krNQx4IfqdfPfleD.jpg"
      },
      {
        "id": 1639,
        "name": "Emily Watson",
        "character": "Beryl Wilde",
        "profile_path": "/bd0qiJXHoLNpkCqABsh67AKRtjC.jpg"
      },
      {
        "id": 16358,
        "name": "Simon McBurney",
        "character": "Frank Hawking",
        "profile_path": "/h0J9UH1g1C0c8T8x1mjvfUv5X5f.jpg"
      },
      {
        "id": 11207,
        "name": "David Thewlis",
        "character": "Dennis Sciama",
        "profile_path": "/sNuYyT8ocLlQr3TdAW9CoKVbCU8.jpg"
      }
    ],
    "imdbRating": "7.7"
  },
  {
    "id": "f29",
    "title": "A Beautiful Mind",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 453,
    "posterPath": "/rEIg5yJdNOt9fmX4P8gU9LeNoTQ.jpg",
    "backdropPath": "/vVBcIN68kFq681b4lObiNJhEVro.jpg",
    "trailerKey": "yC2VpkVMtXY",
    "rating": 7.9,
    "cast": [
      {
        "id": 934,
        "name": "Russell Crowe",
        "character": "John Nash",
        "profile_path": "/uxiXuVH4vNWrKlJMVVPG1sxAJFe.jpg"
      },
      {
        "id": 6161,
        "name": "Jennifer Connelly",
        "character": "Alicia Nash",
        "profile_path": "/wdmcJagSRJ65AuJ4IUCzuHAdvgy.jpg"
      },
      {
        "id": 228,
        "name": "Ed Harris",
        "character": "William Parcher",
        "profile_path": "/kUbUA70WPiosPT4kBJMWtGk0ASd.jpg"
      },
      {
        "id": 6162,
        "name": "Paul Bettany",
        "character": "Charles Herman",
        "profile_path": "/vcAVrAOZrpqmi37qjFdztRAv1u9.jpg"
      },
      {
        "id": 290,
        "name": "Christopher Plummer",
        "character": "Dr. Rosen",
        "profile_path": "/u0YBwss0ebEUp8sjRtQKnK2wZdR.jpg"
      },
      {
        "id": 6163,
        "name": "Adam Goldberg",
        "character": "Richard Sol",
        "profile_path": "/xEbqDqTWlSSCi4v8FI3S9YSEPJz.jpg"
      }
    ],
    "imdbRating": "8.2"
  },
  {
    "id": "f30",
    "title": "The Imitation Game / Enigma",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 205596,
    "posterPath": "/zSqJ1qFq8NXFfi7JeIYMlzyR0dx.jpg",
    "backdropPath": "/4vf5Fv6OVXXrNqEXqiJnWxnNSyV.jpg",
    "trailerKey": "j2jRs4EAvWM",
    "rating": 8,
    "cast": [
      {
        "id": 71580,
        "name": "Benedict Cumberbatch",
        "character": "Alan Turing",
        "profile_path": "/wz3MRiMmoz6b5X3oSzMRC9nLxY1.jpg"
      },
      {
        "id": 116,
        "name": "Keira Knightley",
        "character": "Joan Clarke",
        "profile_path": "/bRC1B2VwV0wK3ElciFAK6QZf2wD.jpg"
      },
      {
        "id": 1247,
        "name": "Matthew Goode",
        "character": "Hugh Alexander",
        "profile_path": "/3XaKKl0bKswTWbJ0Lh9nZ4UdAQo.jpg"
      },
      {
        "id": 139549,
        "name": "Rory Kinnear",
        "character": "Detective Robert Nock",
        "profile_path": "/8aEABMeHXOozwE5DrMxUlCM9mpG.jpg"
      },
      {
        "id": 85718,
        "name": "Allen Leech",
        "character": "John Cairncross",
        "profile_path": "/cJZSyKNUKwdNPEgkt2ocXohtUBH.jpg"
      },
      {
        "id": 213394,
        "name": "Matthew Beard",
        "character": "Peter Hilton",
        "profile_path": "/qbFEcaQLnE0bU8xutnsmYzKrjn0.jpg"
      }
    ],
    "imdbRating": "8.0"
  },
  {
    "id": "f31",
    "title": "The King's Speech / Zoraki Kral",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 45269,
    "posterPath": "/pVNKXVQFukBaCz6ML7GH3kiPlQP.jpg",
    "backdropPath": "/6dyqfaPdeM5Z22ylw9ZTyjROBo7.jpg",
    "trailerKey": "HXMqX9s67kY",
    "rating": 7.7,
    "cast": [
      {
        "id": 5472,
        "name": "Colin Firth",
        "character": "King George VI",
        "profile_path": "/4VBeYEUQbfhnivdkqInM36u5fda.jpg"
      },
      {
        "id": 118,
        "name": "Geoffrey Rush",
        "character": "Lionel Logue",
        "profile_path": "/npXFjaFQzBNroCEPllGPTZ5IisA.jpg"
      },
      {
        "id": 1283,
        "name": "Helena Bonham Carter",
        "character": "Queen Elizabeth",
        "profile_path": "/hJMbNSPJ2PCahsP3rNEU39C8GWU.jpg"
      },
      {
        "id": 529,
        "name": "Guy Pearce",
        "character": "King Edward VIII",
        "profile_path": "/vTqk6Nh3WgqPubkS23eOlMAwmwa.jpg"
      },
      {
        "id": 9191,
        "name": "Timothy Spall",
        "character": "Winston Churchill",
        "profile_path": "/pcR6t8kpAgGwIUo4UjlP5gyKkNA.jpg"
      },
      {
        "id": 5658,
        "name": "Michael Gambon",
        "character": "King George V",
        "profile_path": "/3jdWkDKf4IODbG4JKTeaC7AzxZH.jpg"
      }
    ],
    "imdbRating": "8.0"
  },
  {
    "id": "f32",
    "title": "V for Vendetta",
    "isWatched": true,
    "watchedAt": "2025-12-30T00:00:00Z",
    "tagColor": "blue",
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 752,
    "posterPath": "/piZOwjyk1g51oPHonc7zaQY3WOv.jpg",
    "backdropPath": "/5EKplo61HbA5sMGAN0XAvzdo1MX.jpg",
    "trailerKey": "3ge0navn9E0",
    "rating": 7.9,
    "cast": [
      {
        "id": 524,
        "name": "Natalie Portman",
        "character": "Evey",
        "profile_path": "/edPU5HxncLWa1YkgRPNkSd68ONG.jpg"
      },
      {
        "id": 1331,
        "name": "Hugo Weaving",
        "character": "V / William Rookwood",
        "profile_path": "/lSC8Et0PYi5zeQb3IpPkFje7hgR.jpg"
      },
      {
        "id": 9029,
        "name": "Stephen Rea",
        "character": "Finch",
        "profile_path": "/e4zy2Js6Yz7G2dGYZh1vZRAL5DI.jpg"
      },
      {
        "id": 11275,
        "name": "Stephen Fry",
        "character": "Deitrich",
        "profile_path": "/lv2nwyciDv1P5FPsjD6DmFzV7Nt.jpg"
      },
      {
        "id": 5049,
        "name": "John Hurt",
        "character": "Adam Sutler",
        "profile_path": "/bjNSzt1d7uK3q5PbtFXUJrRt4qg.jpg"
      },
      {
        "id": 11276,
        "name": "Tim Pigott-Smith",
        "character": "Creedy",
        "profile_path": "/37OZUY7cq8eoWxhKR2VD1ppusJM.jpg"
      }
    ],
    "imdbRating": "8.1"
  },
  {
    "id": "f33",
    "title": "Limitless / Limit Yok",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 51876,
    "posterPath": "/kCokPP4WCQRrrAuZ7FcpIyHr8b2.jpg",
    "backdropPath": "/9V6Yq2ZVUmyAPcPyDcCBPnkluKF.jpg",
    "trailerKey": "4TLppsfzQH8",
    "rating": 7.2,
    "cast": [
      {
        "id": 51329,
        "name": "Bradley Cooper",
        "character": "Edward Morra",
        "profile_path": "/sQq0nft6YZmJ7EMQwPcbaxym3AL.jpg"
      },
      {
        "id": 380,
        "name": "Robert De Niro",
        "character": "Carl Van Loon",
        "profile_path": "/cT8htcckIuyI1Lqwt1CvD02ynTh.jpg"
      },
      {
        "id": 37260,
        "name": "Abbie Cornish",
        "character": "Lindy",
        "profile_path": "/AgIA8uPnwySIbqaPjr5jEXwZbS.jpg"
      },
      {
        "id": 67206,
        "name": "Andrew Howard",
        "character": "Gennady",
        "profile_path": "/kba1JeCUYHufjB933G5xPRhO8lV.jpg"
      },
      {
        "id": 58016,
        "name": "Anna Friel",
        "character": "Melissa",
        "profile_path": "/uY9ugiMtyvNp8cN7jvNZfin7sud.jpg"
      },
      {
        "id": 73589,
        "name": "Johnny Whitworth",
        "character": "Vernon",
        "profile_path": "/v8pUdmBfRp4oQuG7PAAXtsvuomk.jpg"
      }
    ],
    "imdbRating": "7.4"
  },
  {
    "id": "f34",
    "title": "The Usual Suspects / Olağan Şüpheliler",
    "isWatched": true,
    "watchedAt": "2025-10-18T00:00:00Z",
    "tagColor": "blue",
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 629,
    "posterPath": "/99X2SgyFunJFXGAYnDv3sb9pnUD.jpg",
    "backdropPath": "/hy0Hx9fMPk2fmw26Li60z1S2giU.jpg",
    "trailerKey": "jM3jrHGAsIE",
    "rating": 8.2,
    "cast": [
      {
        "id": 9045,
        "name": "Stephen Baldwin",
        "character": "McManus",
        "profile_path": "/w2nZjBsEsjboQDZJXEkysuGgue4.jpg"
      },
      {
        "id": 5168,
        "name": "Gabriel Byrne",
        "character": "Keaton",
        "profile_path": "/9r9oDGENg92VYYFMkV4C09IUlrb.jpg"
      },
      {
        "id": 1121,
        "name": "Benicio del Toro",
        "character": "Fenster",
        "profile_path": "/aYomJWx0B2B8ra6Rmgt8lr0XCrw.jpg"
      },
      {
        "id": 7166,
        "name": "Kevin Pollak",
        "character": "Hockney",
        "profile_path": "/jWhKIVtmc3vIoS2l1VsdNwMAMJB.jpg"
      },
      {
        "id": 1979,
        "name": "Kevin Spacey",
        "character": "Verbal",
        "profile_path": "/nPrUZDEbGQe6jwpVbHKJCXsMd7r.jpg"
      },
      {
        "id": 9046,
        "name": "Chazz Palminteri",
        "character": "Dave Kujan",
        "profile_path": "/mCbjKVyE5B2tleshbJw44tw3ktZ.jpg"
      }
    ],
    "imdbRating": "8.5"
  },
  {
    "id": "f35",
    "title": "2001: A Space Odyssey",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 62,
    "posterPath": "/ve72VxNqjGM69Uky4WTo2bK6rfq.jpg",
    "backdropPath": "/w5IDXtifKntw0ajv2co7jFlTQDM.jpg",
    "trailerKey": "kR2r-A9H3Kg",
    "rating": 8.1,
    "cast": [
      {
        "id": 245,
        "name": "Keir Dullea",
        "character": "Dr. David Bowman",
        "profile_path": "/5QyrGWxujX8XA3Ny3M8D18TWupi.jpg"
      },
      {
        "id": 246,
        "name": "Gary Lockwood",
        "character": "Dr. Frank Poole",
        "profile_path": "/1tfGE7RW8GgCLEFFJUXETq9Td1T.jpg"
      },
      {
        "id": 247,
        "name": "William Sylvester",
        "character": "Dr. Heywood Floyd",
        "profile_path": "/4NaExzBKqv4GPEfJ2w7S16MYS2y.jpg"
      },
      {
        "id": 253,
        "name": "Douglas Rain",
        "character": "HAL 9000 (voice)",
        "profile_path": "/wCjNcbW1u9cYc7jzlV5FPKqXGNF.jpg"
      },
      {
        "id": 248,
        "name": "Daniel Richter",
        "character": "Moonwatcher",
        "profile_path": "/cq8Fprv33RgYPwu39cGx6fxk5Qp.jpg"
      },
      {
        "id": 249,
        "name": "Leonard Rossiter",
        "character": "Dr. Andrei Smyslov",
        "profile_path": "/qXjGUJ2TjO3ltiEYMEJ658VeqkA.jpg"
      }
    ],
    "imdbRating": "8.3"
  },
  {
    "id": "f36",
    "title": "The Clockwork Orange / Otomatik Portakal",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 143054,
    "posterPath": "/4tOeLVwr8ss7kncXiIF5n3UEuQo.jpg",
    "backdropPath": "/7JM0tqX6IwhH8KkF8seJRy7gxqw.jpg",
    "trailerKey": null,
    "rating": 5.1,
    "cast": [
      {
        "id": 63120,
        "name": "William Boyd",
        "character": "Self",
        "profile_path": "/oV43U7s1uKhwsrsekL2aVXDE7vX.jpg"
      },
      {
        "id": 2262,
        "name": "Anthony Burgess",
        "character": "Self (archive footage)",
        "profile_path": "/hke7hc7LID3DBeNc8BmafQ75Js1.jpg"
      },
      {
        "id": 1118266,
        "name": "Robin Duval",
        "character": "Self",
        "profile_path": null
      },
      {
        "id": 16378,
        "name": "Mary Harron",
        "character": "Self",
        "profile_path": "/NAUg6eMuJ8aIzkLiyxVVxPEKEX.jpg"
      },
      {
        "id": 1118267,
        "name": "Edward Heath",
        "character": "Self (archive footage)",
        "profile_path": "/fVEh2njfrHe3LnRrogpjimYXZoP.jpg"
      },
      {
        "id": 558273,
        "name": "Damien Hirst",
        "character": "Self",
        "profile_path": "/lCHFMwXW2y2R0iD3B7y0oaljaxV.jpg"
      }
    ],
    "imdbRating": "7.0"
  },
  {
    "id": "f37",
    "title": "Good Will Hunting / Can Dostum",
    "isWatched": true,
    "watchedAt": "2025-11-23T00:00:00Z",
    "tagColor": "blue",
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 489,
    "posterPath": "/z2FnLKpFi1HPO7BEJxdkv6hpJSU.jpg",
    "backdropPath": "/xj1Sv1xm4Y0ydBueGuf10Y9qM0O.jpg",
    "trailerKey": "_X0XUBOcsxI",
    "rating": 8.2,
    "cast": [
      {
        "id": 1892,
        "name": "Matt Damon",
        "character": "Will Hunting",
        "profile_path": "/At3JgvaNeEN4Z4ESKlhhes85Xo3.jpg"
      },
      {
        "id": 2157,
        "name": "Robin Williams",
        "character": "Sean Maguire",
        "profile_path": "/iYdeP6K0qz44Wg2Nw9LPJGMBkQ5.jpg"
      },
      {
        "id": 880,
        "name": "Ben Affleck",
        "character": "Chuckie Sullivan",
        "profile_path": "/aTcqu8cI4wMohU17xTdqmXKTGrw.jpg"
      },
      {
        "id": 1640,
        "name": "Stellan Skarsgård",
        "character": "Gerald Lambeau",
        "profile_path": "/mW7xmtGV4y79kQGn0zkKVGDMAmw.jpg"
      },
      {
        "id": 6613,
        "name": "Minnie Driver",
        "character": "Skylar",
        "profile_path": "/2uwaHwpoutbXMuYY5v2dhWU0hml.jpg"
      },
      {
        "id": 1893,
        "name": "Casey Affleck",
        "character": "Morgan O'Mally",
        "profile_path": "/304ilSygaCRWykoBWAL67TOw8g9.jpg"
      }
    ],
    "imdbRating": "8.4"
  },
  {
    "id": "f38",
    "title": "Once Upon A Time in America",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 311,
    "posterPath": "/i0enkzsL5dPeneWnjl1fCWm6L7k.jpg",
    "backdropPath": "/xlDUjb0Q5Dv6jPQRF5VE4IMjIy.jpg",
    "trailerKey": "lFw062jAYR0",
    "rating": 8.4,
    "cast": [
      {
        "id": 380,
        "name": "Robert De Niro",
        "character": "David 'Noodles' Aaronson",
        "profile_path": "/cT8htcckIuyI1Lqwt1CvD02ynTh.jpg"
      },
      {
        "id": 4512,
        "name": "James Woods",
        "character": "Maximilian 'Max' Bercovicz",
        "profile_path": "/tLH7mpH4KqkWL5VgjueTbewGsfK.jpg"
      },
      {
        "id": 4513,
        "name": "Elizabeth McGovern",
        "character": "Deborah Gelly",
        "profile_path": "/nA5jJkV5YyYvhpaMD285qQnOWGv.jpg"
      },
      {
        "id": 4515,
        "name": "Treat Williams",
        "character": "James Conway O'Donnell",
        "profile_path": "/jbRMOU2K7ePg7Zs59nfgEYLeD1e.jpg"
      },
      {
        "id": 4514,
        "name": "Tuesday Weld",
        "character": "Carol",
        "profile_path": "/9d58qElviT6Q9soeixJmxWtaMBc.jpg"
      },
      {
        "id": 4517,
        "name": "Joe Pesci",
        "character": "Frankie Monaldi",
        "profile_path": "/zbAdhqbMfRXSz26TjxJvB5f2eL5.jpg"
      }
    ],
    "imdbRating": "8.3"
  },
  {
    "id": "f39",
    "title": "Donnie Darko",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 141,
    "posterPath": "/sv7D4vlfIH25lNjQYoXzoOFCYaz.jpg",
    "backdropPath": "/msCHK5Kh1YbdZ0zPJ2nzPUhhSN9.jpg",
    "trailerKey": "71RaE7JYTUU",
    "rating": 7.8,
    "cast": [
      {
        "id": 131,
        "name": "Jake Gyllenhaal",
        "character": "Donnie Darko",
        "profile_path": "/rJdYHYNhlcOBwbPvDZVvt1xw7bi.jpg"
      },
      {
        "id": 20089,
        "name": "Jena Malone",
        "character": "Gretchen Ross",
        "profile_path": "/kGwV9iLmfUxJ6a73ehr0QvAnc8C.jpg"
      },
      {
        "id": 1582,
        "name": "James Duval",
        "character": "Frank",
        "profile_path": "/vvasxKKPnxv2qOoXTnaXW3ecGLO.jpg"
      },
      {
        "id": 69597,
        "name": "Drew Barrymore",
        "character": "Karen Pomeroy",
        "profile_path": "/9xMu2GLC5otUcC11sEWC5aEAERQ.jpg"
      },
      {
        "id": 5151,
        "name": "Beth Grant",
        "character": "Kitty Farmer",
        "profile_path": "/6THLoPYhIu422TqUmQDgnQRfYxA.jpg"
      },
      {
        "id": 1579,
        "name": "Maggie Gyllenhaal",
        "character": "Elizabeth Darko",
        "profile_path": "/vsfkWdYWmA9CpzMHTJzrFxlDnEZ.jpg"
      }
    ],
    "imdbRating": "8.0"
  },
  {
    "id": "f40",
    "title": "The Sixth Sense / Altıncı His",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 745,
    "posterPath": "/vOyfUXNFSnaTk7Vk5AjpsKTUWsu.jpg",
    "backdropPath": "/6TjllWT3cGrPFyqDXurVZ3L8bBi.jpg",
    "trailerKey": "HXG4HTIlc1U",
    "rating": 8,
    "cast": [
      {
        "id": 62,
        "name": "Bruce Willis",
        "character": "Malcolm Crowe",
        "profile_path": "/w3aXr1e7gQCn8MSp1vW4sXHn99P.jpg"
      },
      {
        "id": 9640,
        "name": "Haley Joel Osment",
        "character": "Cole Sear",
        "profile_path": "/2rnMTQB9Q3vLtmRyyUaenVwSgfY.jpg"
      },
      {
        "id": 3051,
        "name": "Toni Collette",
        "character": "Lynn Sear",
        "profile_path": "/lzXRh16qe4HHeBN6tMyw0DHvaMn.jpg"
      },
      {
        "id": 11616,
        "name": "Olivia Williams",
        "character": "Anna Crowe",
        "profile_path": "/94bnuQXo3LoxNvcFXeAoVvIIm3N.jpg"
      },
      {
        "id": 4940,
        "name": "Trevor Morgan",
        "character": "Tommy Tammisimo",
        "profile_path": "/txZ59fUmdyyv5cowmFDu85HiBeF.jpg"
      },
      {
        "id": 2680,
        "name": "Donnie Wahlberg",
        "character": "Vincent Gray",
        "profile_path": "/8OQTlgl7eGAFlKTF2o8rZZT0MoF.jpg"
      }
    ],
    "imdbRating": "8.2"
  },
  {
    "id": "f41",
    "title": "The Town / Hırsızlar Şehri",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 23168,
    "posterPath": "/3NIzyXkfylsjflRKSz8Fts3lXzm.jpg",
    "backdropPath": "/owAe5rRStnX7ibVAPmza3NCXjCy.jpg",
    "trailerKey": "uAjECYnrYks",
    "rating": 7.2,
    "cast": [
      {
        "id": 880,
        "name": "Ben Affleck",
        "character": "Doug MacRay",
        "profile_path": "/aTcqu8cI4wMohU17xTdqmXKTGrw.jpg"
      },
      {
        "id": 17604,
        "name": "Jeremy Renner",
        "character": "James \"Jem\" Coughlin",
        "profile_path": "/yB84D1neTYXfWBaV0QOE9RF2VCu.jpg"
      },
      {
        "id": 15556,
        "name": "Rebecca Hall",
        "character": "Claire Keesey",
        "profile_path": "/u1Q7HF01llNzx0yx0A8g2W0Xj9L.jpg"
      },
      {
        "id": 65717,
        "name": "Jon Hamm",
        "character": "FBI S.A. Adam Frawley",
        "profile_path": "/mrXE5fZbEDPc7BEE5G21J6qrwzi.jpg"
      },
      {
        "id": 59175,
        "name": "Blake Lively",
        "character": "Krista Coughlin",
        "profile_path": "/rkGVjd6wImtgjOCi0IpeffdEWtb.jpg"
      },
      {
        "id": 133067,
        "name": "George Carroll",
        "character": "Albert \"Gloansy\" Magloan",
        "profile_path": "/dtPCKR8BWu5Q7CnNRdHWY5dB7Jt.jpg"
      }
    ],
    "imdbRating": "7.5"
  },
  {
    "id": "f42",
    "title": "A Bronx Tale / Günaha Davet",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 1607,
    "posterPath": "/sDbO6LmLYtyqAoFTPpRcMgPSCEO.jpg",
    "backdropPath": "/ggzzn1Hf4zBz1VVywpQhGtDxKtA.jpg",
    "trailerKey": "v77Dj4FhIA8",
    "rating": 7.9,
    "cast": [
      {
        "id": 380,
        "name": "Robert De Niro",
        "character": "Lorenzo Anello",
        "profile_path": "/cT8htcckIuyI1Lqwt1CvD02ynTh.jpg"
      },
      {
        "id": 9046,
        "name": "Chazz Palminteri",
        "character": "Sonny LoSpecchio",
        "profile_path": "/mCbjKVyE5B2tleshbJw44tw3ktZ.jpg"
      },
      {
        "id": 17917,
        "name": "Lillo Brancato",
        "character": "Calogero 'C' Anello (Age 17)",
        "profile_path": "/vUIga1je7MRsPSeJJvmtIpxfyRo.jpg"
      },
      {
        "id": 17918,
        "name": "Francis Capra",
        "character": "Calogero 'C' Anello (Age 9)",
        "profile_path": "/iMbTbfIKNqjNwtwtdMLMRJUG1ej.jpg"
      },
      {
        "id": 17919,
        "name": "Taral Hicks",
        "character": "Jane Williams",
        "profile_path": "/vospKzNf1QPbToCg4aN26BzT8o6.jpg"
      },
      {
        "id": 17920,
        "name": "Kathrine Narducci",
        "character": "Rosina Anello",
        "profile_path": "/bOxhHtEtmhdfVmnL0KyG4SPDlwJ.jpg"
      }
    ],
    "imdbRating": "7.8"
  },
  {
    "id": "f43",
    "title": "A Dangerous Method / Tehlikeli İlişki",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 48231,
    "posterPath": "/7TPYtzq9ABkfED1JB0tRASamL4z.jpg",
    "backdropPath": "/iGMz1vJEVZNdBafpE7vrHIj1Quo.jpg",
    "trailerKey": "ZhunuJRo8jA",
    "rating": 6.4,
    "cast": [
      {
        "id": 116,
        "name": "Keira Knightley",
        "character": "Sabina Spielrein",
        "profile_path": "/bRC1B2VwV0wK3ElciFAK6QZf2wD.jpg"
      },
      {
        "id": 110,
        "name": "Viggo Mortensen",
        "character": "Sigmund Freud",
        "profile_path": "/vH5gVSpHAMhDaFWfh0Q7BG61O1y.jpg"
      },
      {
        "id": 17288,
        "name": "Michael Fassbender",
        "character": "Carl Jung",
        "profile_path": "/xvbnUiB2ZBR3QIt595OzNy657Vw.jpg"
      },
      {
        "id": 190895,
        "name": "Sarah Gadon",
        "character": "Emma Jung",
        "profile_path": "/sWBMkqjRiszNrvaLE2SSedG9szT.jpg"
      },
      {
        "id": 1925,
        "name": "Vincent Cassel",
        "character": "Otto Gross",
        "profile_path": "/ivUQfhn5olOmR5hthN8C8GThBV4.jpg"
      },
      {
        "id": 1846,
        "name": "André Hennicke",
        "character": "Professor Eugen Bleuler",
        "profile_path": "/ooLG1YJU6hsc5KNGeHqTkwv0GMe.jpg"
      }
    ],
    "imdbRating": "6.4"
  },
  {
    "id": "f44",
    "title": "Dallas Buyers Club / Sınırsızlar Kulübü",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 152532,
    "posterPath": "/7Fdh7gUq3plvQqxRbNYhWvDABXA.jpg",
    "backdropPath": "/sbVKj98cq0FztCukzu47bu0H8o7.jpg",
    "trailerKey": "KDvPcBeOn8E",
    "rating": 7.9,
    "cast": [
      {
        "id": 10297,
        "name": "Matthew McConaughey",
        "character": "Ron Woodroof",
        "profile_path": "/lCySuYjhXix3FzQdS4oceDDrXKI.jpg"
      },
      {
        "id": 9278,
        "name": "Jennifer Garner",
        "character": "Eve",
        "profile_path": "/ftymEXqdTnXfaI6dGd9qrJoFOSE.jpg"
      },
      {
        "id": 7499,
        "name": "Jared Leto",
        "character": "Rayon",
        "profile_path": "/ca3x0OfIKbJppZh8S1Alx3GfUZO.jpg"
      },
      {
        "id": 81681,
        "name": "Denis O'Hare",
        "character": "Dr. Sevard",
        "profile_path": "/zMim5sdMnyd2GFfPd9Jh59Vcog3.jpg"
      },
      {
        "id": 18324,
        "name": "Steve Zahn",
        "character": "Tucker",
        "profile_path": "/rwrPdKGwXnByxUVMxMf8Y7oswi3.jpg"
      },
      {
        "id": 21710,
        "name": "Michael O'Neill",
        "character": "Richard Barkley",
        "profile_path": "/u9Ejl9iS4ZJ36Y653UCe8huLaOn.jpg"
      }
    ],
    "imdbRating": "7.9"
  },
  {
    "id": "f45",
    "title": "For a Few Dollars More / Bir kaç dolar için",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 938,
    "posterPath": "/ooqASvA7qxlTVKL3KwOzBwy57Dh.jpg",
    "backdropPath": "/x0bQvdpr88xVhMrVM93tEIKSM2q.jpg",
    "trailerKey": "xZm8i5sGlWI",
    "rating": 8,
    "cast": [
      {
        "id": 190,
        "name": "Clint Eastwood",
        "character": "Manco",
        "profile_path": "/8TwdCfeOZH7ucRlfLZ6wObxa7cO.jpg"
      },
      {
        "id": 4078,
        "name": "Lee Van Cleef",
        "character": "Col. Douglas Mortimer",
        "profile_path": "/yQc5wjNCdRZzPp5E2wRPRYsEq9a.jpg"
      },
      {
        "id": 14276,
        "name": "Gian Maria Volonté",
        "character": "El Indio",
        "profile_path": "/xPwxiUgSnvqMvPTm2TlqTUskOJ.jpg"
      },
      {
        "id": 5814,
        "name": "Luigi Pistilli",
        "character": "Groggy, Member of Indio's Gang",
        "profile_path": "/bH5vmD2CMBHzJyBe0P0bL6iTUNL.jpg"
      },
      {
        "id": 14277,
        "name": "Klaus Kinski",
        "character": "Juan Wild - The Hunchback",
        "profile_path": "/twuyGlZJzJXFcbhVS2jlQOsTVFK.jpg"
      },
      {
        "id": 14279,
        "name": "Joseph Egger",
        "character": "Old Prophet",
        "profile_path": "/qbYagO1s87kPadJLBCYTuihO2CV.jpg"
      }
    ],
    "imdbRating": "8.2"
  },
  {
    "id": "f46",
    "title": "October Sky / Ekim Düşü",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 13466,
    "posterPath": "/umWrXCIWdcYPf764ruvMRCpG3cA.jpg",
    "backdropPath": "/c6uIPrMgvDzhEGSKuZc8aw6NfC.jpg",
    "trailerKey": "4cmMukCFyd8",
    "rating": 7.7,
    "cast": [
      {
        "id": 131,
        "name": "Jake Gyllenhaal",
        "character": "Homer Hickam",
        "profile_path": "/rJdYHYNhlcOBwbPvDZVvt1xw7bi.jpg"
      },
      {
        "id": 2955,
        "name": "Chris Cooper",
        "character": "John Hickam",
        "profile_path": "/j0sQDzaDlnNAdaYhy6HRRAFi22.jpg"
      },
      {
        "id": 26999,
        "name": "Chris Owen",
        "character": "Quentin Wilson",
        "profile_path": "/lbpz1BSNahnkyE7FZ1tWcIy35w0.jpg"
      },
      {
        "id": 4784,
        "name": "Laura Dern",
        "character": "Miss Riley",
        "profile_path": "/gB9PnGEvxKg33OSlcqptQwTBwPE.jpg"
      },
      {
        "id": 10128,
        "name": "William Lee Scott",
        "character": "Roy Lee",
        "profile_path": "/p6mISLnDP84gaBOiXSpOenFO8Zd.jpg"
      },
      {
        "id": 9186,
        "name": "Chad Lindberg",
        "character": "O'Dell",
        "profile_path": "/sUaxwqrwYjZGtLcRH3rsyBd1L9d.jpg"
      }
    ],
    "imdbRating": "7.8"
  },
  {
    "id": "f47",
    "title": "Wild Hogs / Çılgın Motorcular",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 11199,
    "posterPath": "/qYyPCZcpNGZwbyBo1gwdCiW5hHC.jpg",
    "backdropPath": "/es74vwJqbT6cwMdJmTeSIcjJjoo.jpg",
    "trailerKey": "r6SSpOJ_aS4",
    "rating": 6,
    "cast": [
      {
        "id": 12898,
        "name": "Tim Allen",
        "character": "Doug Madsen",
        "profile_path": "/woWhZzFILVhYMAvsPL171HjMY0y.jpg"
      },
      {
        "id": 8891,
        "name": "John Travolta",
        "character": "Woody Stevens",
        "profile_path": "/ap8eEYfBKTLixmVVpRlq4NslDD5.jpg"
      },
      {
        "id": 78029,
        "name": "Martin Lawrence",
        "character": "Bobby Davis",
        "profile_path": "/y3SQzIPUPJpdueb1DkbTYph68nk.jpg"
      },
      {
        "id": 3905,
        "name": "William H. Macy",
        "character": "Dudley Frank",
        "profile_path": "/hdVEGSrP8qWlJnt0v5vSVcGOjy7.jpg"
      },
      {
        "id": 11477,
        "name": "Ray Liotta",
        "character": "Jack",
        "profile_path": "/jdwGJbJNSRQiG2kB5MJxiu2clCQ.jpg"
      },
      {
        "id": 79072,
        "name": "Kevin Durand",
        "character": "Red",
        "profile_path": "/hINvryvce5tpod6kTnUg9ZTH8wg.jpg"
      }
    ],
    "imdbRating": "5.9"
  },
  {
    "id": "f48",
    "title": "Liar Liar / Yalancı yalancı",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 1624,
    "posterPath": "/p1habYSdC7oD3WygQ5lynU5G5rV.jpg",
    "backdropPath": "/nuDMG0uTaiWFVD6XfHPruum5JOL.jpg",
    "trailerKey": "odPUipiGYek",
    "rating": 6.7,
    "cast": [
      {
        "id": 206,
        "name": "Jim Carrey",
        "character": "Fletcher Reede",
        "profile_path": "/y3U9QfPN6sJaGl6l68xjwWj28ig.jpg"
      },
      {
        "id": 16307,
        "name": "Maura Tierney",
        "character": "Audrey Reede",
        "profile_path": "/4BCrwdHdC4iRSDimvkoYaXg2qki.jpg"
      },
      {
        "id": 18190,
        "name": "Justin Cooper",
        "character": "Max Reede",
        "profile_path": "/61qQPDArLSjydncUKeBz2D4lXRl.jpg"
      },
      {
        "id": 2130,
        "name": "Cary Elwes",
        "character": "Jerry",
        "profile_path": "/9UszBdQJ9PmyBydIeIBxlStozhW.jpg"
      },
      {
        "id": 11718,
        "name": "Anne Haney",
        "character": "Greta",
        "profile_path": "/yb2RVcI5JLlFlT5wLVa8XNvnbAL.jpg"
      },
      {
        "id": 18191,
        "name": "Amanda Donohoe",
        "character": "Miranda",
        "profile_path": "/KOMTsWlkmkSCf5YSI9KjDJgCXE.jpg"
      }
    ],
    "imdbRating": "6.9"
  },
  {
    "id": "f49",
    "title": "Gulliver'in Gezileri",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2025-01-01T00:00:00Z",
    "tmdbId": 38745,
    "posterPath": "/6NoEtuTwZ04luk5H2DpT5ivW7Mg.jpg",
    "backdropPath": "/1EnX8qIJUYv6mG0Asub6Om8158z.jpg",
    "trailerKey": null,
    "rating": 5.2,
    "cast": [
      {
        "id": 70851,
        "name": "Jack Black",
        "character": "Lemuel Gulliver",
        "profile_path": "/59IhgCtiWI5yTfzPhsjzg7GjCjm.jpg"
      },
      {
        "id": 41088,
        "name": "Jason Segel",
        "character": "Horatio",
        "profile_path": "/aG6tVNSbl1YEjN65G3luFYnWbUM.jpg"
      },
      {
        "id": 5081,
        "name": "Emily Blunt",
        "character": "Princess Mary",
        "profile_path": "/5nCSG5TL1bP1geD8aaBfaLnLLCD.jpg"
      },
      {
        "id": 2956,
        "name": "Amanda Peet",
        "character": "Darcy Silverman",
        "profile_path": "/5TfyCj0X9ftKO11FN057P05s78C.jpg"
      },
      {
        "id": 9188,
        "name": "Billy Connolly",
        "character": "King Theodore",
        "profile_path": "/imqsEA1EPet7OvHx80VfTYfFcWf.jpg"
      },
      {
        "id": 40477,
        "name": "Chris O'Dowd",
        "character": "General Edward",
        "profile_path": "/xhfgliN8DInDVBliPq7JDeKNCvz.jpg"
      }
    ],
    "imdbRating": "4.9"
  },
  {
    "id": "f_1778979876880",
    "title": "Blade Runner 2049",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "createdAt": "2026-05-17T01:04:36.881Z",
    "tmdbId": 335984,
    "posterPath": "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    "backdropPath": "/mVr0UiqyltcfqxbAUcLl9zWL8ah.jpg",
    "trailerKey": "geFtxCSz8xI",
    "rating": 7.6,
    "cast": [
      {
        "id": 30614,
        "name": "Ryan Gosling",
        "character": "'K'",
        "profile_path": "/k50021gkK92Lx6m99pBy6FUOvNf.jpg"
      },
      {
        "id": 3,
        "name": "Harrison Ford",
        "character": "Rick Deckard",
        "profile_path": "/pjBMJVPpcZK23Vt1nzr1zEBTWrP.jpg"
      },
      {
        "id": 224513,
        "name": "Ana de Armas",
        "character": "Joi",
        "profile_path": "/tkBWBvcLTihUcVf6iwbMQTFqEEv.jpg"
      },
      {
        "id": 543530,
        "name": "Dave Bautista",
        "character": "Sapper Morton",
        "profile_path": "/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg"
      },
      {
        "id": 32,
        "name": "Robin Wright",
        "character": "Lieutenant Joshi",
        "profile_path": "/d3rIv0y2p0jMsQ7ViR7O1606NZa.jpg"
      },
      {
        "id": 104632,
        "name": "Sylvia Hoeks",
        "character": "Luv",
        "profile_path": "/wKC9LgqgJRCXuzs1kUKaK7Uicv.jpg"
      }
    ],
    "imdbRating": "8.0"
  },
  {
    "id": "f_1778983201597",
    "title": "Project Hail Mary",
    "isWatched": false,
    "watchedAt": null,
    "tagColor": null,
    "tmdbId": 687163,
    "createdAt": "2026-05-17T02:00:01.598Z",
    "posterPath": "/yihdXomYb5kTeSivtFndMy5iDmf.jpg",
    "backdropPath": "/2I1OFQJ0L9T0dpU6FobKFWV2PxX.jpg",
    "trailerKey": "NKYea63tQmI",
    "rating": 8.5,
    "imdbRating": "8.4",
    "cast": [
      {
        "id": 30614,
        "name": "Ryan Gosling",
        "character": "Ryland Grace",
        "profile_path": "/k50021gkK92Lx6m99pBy6FUOvNf.jpg"
      },
      {
        "id": 7152,
        "name": "Sandra Hüller",
        "character": "Eva Stratt",
        "profile_path": "/jQfKXVCPTH9KEnzHHU4QemCnlMe.jpg"
      },
      {
        "id": 2096164,
        "name": "James Ortiz",
        "character": "Rocky (voice)",
        "profile_path": "/zYYDXniHb36mjG7xK59r9IoOKvt.jpg"
      },
      {
        "id": 2320708,
        "name": "Lionel Boyce",
        "character": "Carl",
        "profile_path": "/hpIxX5nkfA3pWCW8rYkEUCSBVyS.jpg"
      },
      {
        "id": 1454946,
        "name": "Milana Vayntrub",
        "character": "Olesya Ilyukhina",
        "profile_path": "/i5Cou9ExwTZvRRtl79V75CsI7oC.jpg"
      },
      {
        "id": 2131,
        "name": "Ken Leung",
        "character": "Yao",
        "profile_path": "/hpatUP6u74gkpDRmn9voNY9V43O.jpg"
      }
    ]
  }
];
