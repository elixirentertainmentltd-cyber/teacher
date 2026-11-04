export type Creature = { id: string; name: string; image: string; left: number; top: number; size: number };
export type CritterScene = { id: string; name: string; tagline: string; background: string; published: boolean; revision: number; creatures: Creature[] };
export const DEFAULT_SCENES: CritterScene[] = [
  {
    "id": "meadow",
    "name": "Rainbow Meadow",
    "tagline": "A sunny field full of tiny wonders",
    "background": "/calm-critters/meadow/background.webp",
    "published": true,
    "revision": 0,
    "creatures": [
      {
        "id": "meadow-0",
        "name": "Butterfly",
        "image": "/calm-critters/meadow/sprites.webp#0",
        "left": 23,
        "top": 53,
        "size": 10
      },
      {
        "id": "meadow-1",
        "name": "Rabbit",
        "image": "/calm-critters/meadow/sprites.webp#1",
        "left": 71,
        "top": 78,
        "size": 13
      },
      {
        "id": "meadow-2",
        "name": "Ladybird",
        "image": "/calm-critters/meadow/sprites.webp#2",
        "left": 40,
        "top": 84,
        "size": 5
      },
      {
        "id": "meadow-3",
        "name": "Fox",
        "image": "/calm-critters/meadow/sprites.webp#3",
        "left": 83,
        "top": 64,
        "size": 13
      },
      {
        "id": "meadow-4",
        "name": "Hedgehog",
        "image": "/calm-critters/meadow/sprites.webp#4",
        "left": 56,
        "top": 80,
        "size": 13
      },
      {
        "id": "meadow-5",
        "name": "Deer",
        "image": "/calm-critters/meadow/sprites.webp#5",
        "left": 23,
        "top": 73,
        "size": 13
      },
      {
        "id": "meadow-6",
        "name": "Unicorn",
        "image": "/calm-critters/meadow/sprites.webp#6",
        "left": 67,
        "top": 61,
        "size": 13
      },
      {
        "id": "meadow-7",
        "name": "Bee",
        "image": "/calm-critters/meadow/sprites.webp#7",
        "left": 41,
        "top": 49,
        "size": 10
      },
      {
        "id": "meadow-8",
        "name": "Mouse",
        "image": "/calm-critters/meadow/sprites.webp#8",
        "left": 89,
        "top": 82,
        "size": 10
      },
      {
        "id": "meadow-9",
        "name": "Bird",
        "image": "/calm-critters/meadow/sprites.webp#9",
        "left": 31,
        "top": 35,
        "size": 10
      },
      {
        "id": "meadow-10",
        "name": "Snail",
        "image": "/calm-critters/meadow/sprites.webp#10",
        "left": 66,
        "top": 85,
        "size": 10
      },
      {
        "id": "meadow-11",
        "name": "Owl",
        "image": "/calm-critters/meadow/sprites.webp#11",
        "left": 48,
        "top": 65,
        "size": 13
      }
    ]
  },
  {
    "id": "reef",
    "name": "Bubble Bay",
    "tagline": "Make discoveries under the waves",
    "background": "/calm-critters/reef/background.webp",
    "published": true,
    "revision": 0,
    "creatures": [
      {
        "id": "reef-0",
        "name": "Fish",
        "image": "/calm-critters/reef/sprites.webp#0",
        "left": 23,
        "top": 53,
        "size": 13
      },
      {
        "id": "reef-1",
        "name": "Crab",
        "image": "/calm-critters/reef/sprites.webp#1",
        "left": 71,
        "top": 78,
        "size": 13
      },
      {
        "id": "reef-2",
        "name": "Dolphin",
        "image": "/calm-critters/reef/sprites.webp#2",
        "left": 40,
        "top": 84,
        "size": 13
      },
      {
        "id": "reef-3",
        "name": "Octopus",
        "image": "/calm-critters/reef/sprites.webp#3",
        "left": 83,
        "top": 64,
        "size": 13
      },
      {
        "id": "reef-4",
        "name": "Turtle",
        "image": "/calm-critters/reef/sprites.webp#4",
        "left": 56,
        "top": 80,
        "size": 13
      },
      {
        "id": "reef-5",
        "name": "Whale",
        "image": "/calm-critters/reef/sprites.webp#5",
        "left": 23,
        "top": 73,
        "size": 17
      },
      {
        "id": "reef-6",
        "name": "Pufferfish",
        "image": "/calm-critters/reef/sprites.webp#6",
        "left": 67,
        "top": 61,
        "size": 13
      },
      {
        "id": "reef-7",
        "name": "Seahorse",
        "image": "/calm-critters/reef/sprites.webp#7",
        "left": 41,
        "top": 49,
        "size": 13
      },
      {
        "id": "reef-8",
        "name": "Shark",
        "image": "/calm-critters/reef/sprites.webp#8",
        "left": 89,
        "top": 82,
        "size": 13
      },
      {
        "id": "reef-9",
        "name": "Jellyfish",
        "image": "/calm-critters/reef/sprites.webp#9",
        "left": 31,
        "top": 35,
        "size": 13
      },
      {
        "id": "reef-10",
        "name": "Shell",
        "image": "/calm-critters/reef/sprites.webp#10",
        "left": 66,
        "top": 85,
        "size": 13
      },
      {
        "id": "reef-11",
        "name": "Seal",
        "image": "/calm-critters/reef/sprites.webp#11",
        "left": 48,
        "top": 65,
        "size": 13
      }
    ]
  },
  {
    "id": "galaxy",
    "name": "Starlight Valley",
    "tagline": "Explore a galaxy of little surprises",
    "background": "/calm-critters/galaxy/background.webp",
    "published": true,
    "revision": 0,
    "creatures": [
      {
        "id": "galaxy-0",
        "name": "Moon",
        "image": "/calm-critters/galaxy/sprites.webp#0",
        "left": 23,
        "top": 53,
        "size": 13
      },
      {
        "id": "galaxy-1",
        "name": "Rocket",
        "image": "/calm-critters/galaxy/sprites.webp#1",
        "left": 71,
        "top": 78,
        "size": 13
      },
      {
        "id": "galaxy-2",
        "name": "Planet",
        "image": "/calm-critters/galaxy/sprites.webp#2",
        "left": 40,
        "top": 84,
        "size": 13
      },
      {
        "id": "galaxy-3",
        "name": "Star",
        "image": "/calm-critters/galaxy/sprites.webp#3",
        "left": 83,
        "top": 64,
        "size": 13
      },
      {
        "id": "galaxy-4",
        "name": "Alien",
        "image": "/calm-critters/galaxy/sprites.webp#4",
        "left": 56,
        "top": 80,
        "size": 13
      },
      {
        "id": "galaxy-5",
        "name": "Satellite",
        "image": "/calm-critters/galaxy/sprites.webp#5",
        "left": 23,
        "top": 73,
        "size": 13
      },
      {
        "id": "galaxy-6",
        "name": "Flying saucer",
        "image": "/calm-critters/galaxy/sprites.webp#6",
        "left": 67,
        "top": 61,
        "size": 13
      },
      {
        "id": "galaxy-7",
        "name": "Earth",
        "image": "/calm-critters/galaxy/sprites.webp#7",
        "left": 41,
        "top": 49,
        "size": 13
      },
      {
        "id": "galaxy-8",
        "name": "Meteor",
        "image": "/calm-critters/galaxy/sprites.webp#8",
        "left": 89,
        "top": 82,
        "size": 13
      },
      {
        "id": "galaxy-9",
        "name": "Sun",
        "image": "/calm-critters/galaxy/sprites.webp#9",
        "left": 31,
        "top": 35,
        "size": 13
      },
      {
        "id": "galaxy-10",
        "name": "Astronaut",
        "image": "/calm-critters/galaxy/sprites.webp#10",
        "left": 66,
        "top": 85,
        "size": 13
      },
      {
        "id": "galaxy-11",
        "name": "Galaxy",
        "image": "/calm-critters/galaxy/sprites.webp#11",
        "left": 48,
        "top": 65,
        "size": 13
      }
    ]
  },
  {
    "id": "woodland",
    "name": "Whispering Woods",
    "tagline": "Meet curious friends between the trees",
    "background": "/calm-critters/woodland/background.webp",
    "published": true,
    "revision": 0,
    "creatures": [
      {
        "id": "woodland-0",
        "name": "Squirrel",
        "image": "/calm-critters/woodland/sprites.webp#0",
        "left": 23,
        "top": 53,
        "size": 13
      },
      {
        "id": "woodland-1",
        "name": "Fox",
        "image": "/calm-critters/woodland/sprites.webp#1",
        "left": 71,
        "top": 78,
        "size": 13
      },
      {
        "id": "woodland-2",
        "name": "Owl",
        "image": "/calm-critters/woodland/sprites.webp#2",
        "left": 40,
        "top": 84,
        "size": 13
      },
      {
        "id": "woodland-3",
        "name": "Deer",
        "image": "/calm-critters/woodland/sprites.webp#3",
        "left": 83,
        "top": 64,
        "size": 13
      },
      {
        "id": "woodland-4",
        "name": "Hedgehog",
        "image": "/calm-critters/woodland/sprites.webp#4",
        "left": 56,
        "top": 80,
        "size": 13
      },
      {
        "id": "woodland-5",
        "name": "Rabbit",
        "image": "/calm-critters/woodland/sprites.webp#5",
        "left": 23,
        "top": 73,
        "size": 13
      },
      {
        "id": "woodland-6",
        "name": "Bear",
        "image": "/calm-critters/woodland/sprites.webp#6",
        "left": 67,
        "top": 61,
        "size": 13
      },
      {
        "id": "woodland-7",
        "name": "Bird",
        "image": "/calm-critters/woodland/sprites.webp#7",
        "left": 41,
        "top": 49,
        "size": 10
      },
      {
        "id": "woodland-8",
        "name": "Mouse",
        "image": "/calm-critters/woodland/sprites.webp#8",
        "left": 89,
        "top": 82,
        "size": 10
      },
      {
        "id": "woodland-9",
        "name": "Badger",
        "image": "/calm-critters/woodland/sprites.webp#9",
        "left": 31,
        "top": 35,
        "size": 13
      },
      {
        "id": "woodland-10",
        "name": "Wolf",
        "image": "/calm-critters/woodland/sprites.webp#10",
        "left": 66,
        "top": 85,
        "size": 13
      },
      {
        "id": "woodland-11",
        "name": "Butterfly",
        "image": "/calm-critters/woodland/sprites.webp#11",
        "left": 48,
        "top": 65,
        "size": 10
      }
    ]
  },
  {
    "id": "jungle",
    "name": "Jungle Jamboree",
    "tagline": "Find colourful wildlife in a tropical hideaway",
    "background": "/calm-critters/jungle/background.webp",
    "published": true,
    "revision": 0,
    "creatures": [
      {
        "id": "jungle-0",
        "name": "Parrot",
        "image": "/calm-critters/jungle/sprites.webp#0",
        "left": 23,
        "top": 53,
        "size": 13
      },
      {
        "id": "jungle-1",
        "name": "Monkey",
        "image": "/calm-critters/jungle/sprites.webp#1",
        "left": 71,
        "top": 78,
        "size": 13
      },
      {
        "id": "jungle-2",
        "name": "Tiger",
        "image": "/calm-critters/jungle/sprites.webp#2",
        "left": 40,
        "top": 84,
        "size": 13
      },
      {
        "id": "jungle-3",
        "name": "Sloth",
        "image": "/calm-critters/jungle/sprites.webp#3",
        "left": 83,
        "top": 64,
        "size": 13
      },
      {
        "id": "jungle-4",
        "name": "Frog",
        "image": "/calm-critters/jungle/sprites.webp#4",
        "left": 56,
        "top": 80,
        "size": 13
      },
      {
        "id": "jungle-5",
        "name": "Toucan",
        "image": "/calm-critters/jungle/sprites.webp#5",
        "left": 23,
        "top": 73,
        "size": 13
      },
      {
        "id": "jungle-6",
        "name": "Snake",
        "image": "/calm-critters/jungle/sprites.webp#6",
        "left": 67,
        "top": 61,
        "size": 13
      },
      {
        "id": "jungle-7",
        "name": "Gorilla",
        "image": "/calm-critters/jungle/sprites.webp#7",
        "left": 41,
        "top": 49,
        "size": 13
      },
      {
        "id": "jungle-8",
        "name": "Crocodile",
        "image": "/calm-critters/jungle/sprites.webp#8",
        "left": 89,
        "top": 82,
        "size": 13
      },
      {
        "id": "jungle-9",
        "name": "Butterfly",
        "image": "/calm-critters/jungle/sprites.webp#9",
        "left": 31,
        "top": 35,
        "size": 10
      },
      {
        "id": "jungle-10",
        "name": "Elephant",
        "image": "/calm-critters/jungle/sprites.webp#10",
        "left": 66,
        "top": 85,
        "size": 17
      },
      {
        "id": "jungle-11",
        "name": "Leopard",
        "image": "/calm-critters/jungle/sprites.webp#11",
        "left": 48,
        "top": 65,
        "size": 13
      }
    ]
  },
  {
    "id": "arctic",
    "name": "Snowflake Shores",
    "tagline": "Discover friends in a sparkling snowy world",
    "background": "/calm-critters/arctic/background.webp",
    "published": true,
    "revision": 0,
    "creatures": [
      {
        "id": "arctic-0",
        "name": "Penguin",
        "image": "/calm-critters/arctic/sprites.webp#0",
        "left": 23,
        "top": 53,
        "size": 13
      },
      {
        "id": "arctic-1",
        "name": "Polar bear",
        "image": "/calm-critters/arctic/sprites.webp#1",
        "left": 71,
        "top": 78,
        "size": 13
      },
      {
        "id": "arctic-2",
        "name": "Seal",
        "image": "/calm-critters/arctic/sprites.webp#2",
        "left": 40,
        "top": 84,
        "size": 13
      },
      {
        "id": "arctic-3",
        "name": "Fox",
        "image": "/calm-critters/arctic/sprites.webp#3",
        "left": 83,
        "top": 64,
        "size": 13
      },
      {
        "id": "arctic-4",
        "name": "Whale",
        "image": "/calm-critters/arctic/sprites.webp#4",
        "left": 56,
        "top": 80,
        "size": 17
      },
      {
        "id": "arctic-5",
        "name": "Owl",
        "image": "/calm-critters/arctic/sprites.webp#5",
        "left": 23,
        "top": 73,
        "size": 13
      },
      {
        "id": "arctic-6",
        "name": "Wolf",
        "image": "/calm-critters/arctic/sprites.webp#6",
        "left": 67,
        "top": 61,
        "size": 13
      },
      {
        "id": "arctic-7",
        "name": "Fish",
        "image": "/calm-critters/arctic/sprites.webp#7",
        "left": 41,
        "top": 49,
        "size": 13
      },
      {
        "id": "arctic-8",
        "name": "Rabbit",
        "image": "/calm-critters/arctic/sprites.webp#8",
        "left": 89,
        "top": 82,
        "size": 13
      },
      {
        "id": "arctic-9",
        "name": "Snowman",
        "image": "/calm-critters/arctic/sprites.webp#9",
        "left": 31,
        "top": 35,
        "size": 13
      },
      {
        "id": "arctic-10",
        "name": "Walrus",
        "image": "/calm-critters/arctic/sprites.webp#10",
        "left": 66,
        "top": 85,
        "size": 13
      },
      {
        "id": "arctic-11",
        "name": "Orca",
        "image": "/calm-critters/arctic/sprites.webp#11",
        "left": 48,
        "top": 65,
        "size": 13
      }
    ]
  },
  {
    "id": "dinosaurs",
    "name": "Dinosaur Discovery",
    "tagline": "Travel back to a world of prehistoric giants",
    "background": "/calm-critters/dinosaurs/background.webp",
    "published": true,
    "revision": 0,
    "creatures": [
      {
        "id": "dinosaurs-0",
        "name": "Diplodocus",
        "image": "/calm-critters/dinosaurs/sprites.webp#0",
        "left": 23,
        "top": 53,
        "size": 17
      },
      {
        "id": "dinosaurs-1",
        "name": "Tyrannosaurus",
        "image": "/calm-critters/dinosaurs/sprites.webp#1",
        "left": 71,
        "top": 78,
        "size": 17
      },
      {
        "id": "dinosaurs-2",
        "name": "Egg",
        "image": "/calm-critters/dinosaurs/sprites.webp#2",
        "left": 40,
        "top": 84,
        "size": 13
      },
      {
        "id": "dinosaurs-3",
        "name": "Dragonfly",
        "image": "/calm-critters/dinosaurs/sprites.webp#3",
        "left": 83,
        "top": 64,
        "size": 10
      },
      {
        "id": "dinosaurs-4",
        "name": "Triceratops",
        "image": "/calm-critters/dinosaurs/sprites.webp#4",
        "left": 56,
        "top": 80,
        "size": 13
      },
      {
        "id": "dinosaurs-5",
        "name": "Fern",
        "image": "/calm-critters/dinosaurs/sprites.webp#5",
        "left": 23,
        "top": 73,
        "size": 13
      },
      {
        "id": "dinosaurs-6",
        "name": "Raptor",
        "image": "/calm-critters/dinosaurs/sprites.webp#6",
        "left": 67,
        "top": 61,
        "size": 13
      },
      {
        "id": "dinosaurs-7",
        "name": "Volcano",
        "image": "/calm-critters/dinosaurs/sprites.webp#7",
        "left": 41,
        "top": 49,
        "size": 13
      },
      {
        "id": "dinosaurs-8",
        "name": "Baby dinosaur",
        "image": "/calm-critters/dinosaurs/sprites.webp#8",
        "left": 89,
        "top": 82,
        "size": 13
      },
      {
        "id": "dinosaurs-9",
        "name": "Ancient turtle",
        "image": "/calm-critters/dinosaurs/sprites.webp#9",
        "left": 31,
        "top": 35,
        "size": 13
      },
      {
        "id": "dinosaurs-10",
        "name": "Pterodactyl",
        "image": "/calm-critters/dinosaurs/sprites.webp#10",
        "left": 66,
        "top": 85,
        "size": 13
      },
      {
        "id": "dinosaurs-11",
        "name": "Fossil",
        "image": "/calm-critters/dinosaurs/sprites.webp#11",
        "left": 48,
        "top": 65,
        "size": 13
      }
    ]
  }
];
