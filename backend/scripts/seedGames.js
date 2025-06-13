require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('../models/Game');
const Category = require('../models/Category');
const Genre = require('../models/Genre');
const Platform = require('../models/Platform');
const Language = require('../models/Language');

async function seedGames() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connesso al DB');

    // Pulisce la collezione games
    const deleted = await Game.deleteMany({});
    console.log(`Eliminati ${deleted.deletedCount} giochi.`);

    // Carica dati di riferimento
    const categories = await Category.find({});
    const genres = await Genre.find({});
    const platforms = await Platform.find({});
    const languages = await Language.find({});

    // Helper per trovare _id da nomi (array)
    const getIds = (items, names) =>
      items.filter(i => names.includes(i.name || i.category || i.genre || i.platform)).map(i => i._id);

    const gamesData = [
      {
        title: 'Among Us',
        coverImage: '/assets/games/Among Us-Cover.jpg',
        description: 'Social deduction multiplayer game.',
        producer: 'Innersloth',
        category: getIds(categories, ['Casual', 'Party']),
        releaseDate: new Date('2018-06-15'),
        platforms: getIds(platforms, ['PC', 'iOS', 'Android']),
        genre: getIds(genres, ['Casual', 'Party']),
        languages: {
          interface: getIds(languages, ['english', 'spanish']),
          audio: getIds(languages, []),
          subtitles: getIds(languages, ['english', 'spanish']),
        },
        rating: 3,
        playMode: 'multiplayer',
        trailerUrl: 'https://www.youtube.com/watch?v=NSJklW3aVio',
        pegi: '7',
      },
      {
        title: 'Call of Duty: Modern Warfare',
        coverImage: '/assets/games/Call of Duty-Modern Warfare-Cover.jpg',
        description: 'First-person shooter with realistic combat.',
        producer: 'Infinity Ward',
        category: getIds(categories, ['Shooter', 'Action']),
        releaseDate: new Date('2019-10-25'),
        platforms: getIds(platforms, ['PC', 'PlayStation 4', 'Xbox One']),
        genre: getIds(genres, ['Shooter', 'Action']),
        languages: {
          interface: getIds(languages, ['english']),
          audio: getIds(languages, ['english']),
          subtitles: getIds(languages, ['english']),
        },
        rating: 4,
        playMode: 'multiplayer',
        trailerUrl: 'https://www.youtube.com/watch?v=OG2CLVGxk3I',
        pegi: '18',
      },
      {
        title: 'Cyberpunk 2077',
        coverImage: '/assets/games/Cyberpunk 2077-Cover.jpg',
        description: 'Futuristic open-world RPG set in Night City.',
        producer: 'CD Projekt Red',
        category: getIds(categories, ['RPG', 'Action']),
        releaseDate: new Date('2020-12-10'),
        platforms: getIds(platforms, ['PC', 'PlayStation 4', 'Xbox One']),
        genre: getIds(genres, ['Role-Playing Game (RPG)', 'Action']),
        languages: {
          interface: getIds(languages, ['english', 'polish', 'german']),
          audio: getIds(languages, ['english']),
          subtitles: getIds(languages, ['english', 'polish', 'german']),
        },
        rating: 4,
        playMode: 'singleplayer',
        trailerUrl: 'https://www.youtube.com/watch?v=FknHjl7eQ6o',
        pegi: '18',
      },
      {
        title: 'Elden Ring',
        coverImage: '/assets/games/Elden-Ring-cover.jpg',
        description: 'Open-world action RPG by FromSoftware.',
        producer: 'FromSoftware',
        category: getIds(categories, ['Action', 'Adventure']),
        releaseDate: new Date('2022-02-25'),
        platforms: getIds(platforms, ['PlayStation 5', 'PC', 'Xbox Series X/S']),
        genre: getIds(genres, ['Role-Playing Game (RPG)', 'Action']),
        languages: {
          interface: getIds(languages, ['english', 'french', 'german']),
          audio: getIds(languages, ['english']),
          subtitles: getIds(languages, ['english', 'french', 'german']),
        },
        rating: 5,
        playMode: 'singleplayer',
        trailerUrl: 'https://www.youtube.com/watch?v=E3Huy2cdih0',
        pegi: '18',
      },
      {
        title: 'Fortnite',
        coverImage: '/assets/games/Fortnite-Cover.jpg',
        description: 'Popular battle royale game.',
        producer: 'Epic Games',
        category: getIds(categories, ['Shooter', 'Battle Royale']),
        releaseDate: new Date('2017-07-25'),
        platforms: getIds(platforms, ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch']),
        genre: getIds(genres, ['Shooter', 'Battle Royale']),
        languages: {
          interface: getIds(languages, ['english', 'italian']),
          audio: getIds(languages, ['english']),
          subtitles: getIds(languages, ['english', 'italian']),
        },
        rating: 3,
        playMode: 'multiplayer',
        trailerUrl: 'https://www.youtube.com/watch?v=2gUtfBmw86Y',
        pegi: '12',
      },
      {
        title: 'God of War (2018)',
        coverImage: '/assets/games/God of War 4-cover.jpg',
        description: 'Action-adventure game featuring Kratos and Atreus.',
        producer: 'Santa Monica Studio',
        category: getIds(categories, ['Action', 'Adventure']),
        releaseDate: new Date('2018-04-20'),
        platforms: getIds(platforms, ['PlayStation 4']),
        genre: getIds(genres, ['Action', 'Adventure']),
        languages: {
          interface: getIds(languages, ['english', 'italian', 'french']),
          audio: getIds(languages, ['english']),
          subtitles: getIds(languages, ['italian', 'french']),
        },
        rating: 5,
        playMode: 'singleplayer',
        trailerUrl: 'https://www.youtube.com/watch?v=K0u_kAWLJOA',
        pegi: '18',
      },
      {
        title: 'Horizon Forbidden West',
        coverImage: '/assets/games/Horizon Forbidden West-Cover.jpg',
        description: 'Action RPG set in a post-apocalyptic world.',
        producer: 'Guerrilla Games',
        category: getIds(categories, ['Action', 'Role-Playing (RPG)']),
        releaseDate: new Date('2022-02-18'),
        platforms: getIds(platforms, ['PlayStation 5', 'PlayStation 4']),
        genre: getIds(genres, ['Role-Playing Game (RPG)', 'Action']),
        languages: {
          interface: getIds(languages, ['english', 'italian']),
          audio: getIds(languages, ['english', 'italian']),
          subtitles: getIds(languages, ['english', 'italian']),
        },
        rating: 4,
        playMode: 'singleplayer',
        trailerUrl: 'https://www.youtube.com/watch?v=Qh1Wmh8vI7w',
        pegi: '16',
      },
      {
        title: 'Minecraft',
        coverImage: '/assets/games/Minecraft-Cover.jpg',
        description: 'Sandbox game about building and exploration.',
        producer: 'Mojang Studios',
        category: getIds(categories, ['Sandbox', 'Indie']),
        releaseDate: new Date('2011-11-18'),
        platforms: getIds(platforms, ['PC', 'Xbox One', 'PlayStation 4', 'Nintendo Switch']),
        genre: getIds(genres, ['Sandbox', 'Indie']),
        languages: {
          interface: getIds(languages, ['english', 'spanish', 'french', 'german']),
          audio: getIds(languages, []),
          subtitles: getIds(languages, ['english', 'spanish', 'french', 'german']),
        },
        rating: 4,
        playMode: 'multiplayer',
        trailerUrl: 'https://www.youtube.com/watch?v=MmB9b5njVbA',
        pegi: '7',
      },
      {
        title: 'Resident Evil Village',
        coverImage: '/assets/games/Resident Evil Village-Cover.jpg',
        description: 'Survival horror game with immersive story.',
        producer: 'Capcom',
        category: getIds(categories, ['Horror', 'Survival']),
        releaseDate: new Date('2021-05-07'),
        platforms: getIds(platforms, ['PlayStation 5', 'PC', 'Xbox Series X/S']),
        genre: getIds(genres, ['Horror', 'Survival']),
        languages: {
          interface: getIds(languages, ['english', 'german']),
          audio: getIds(languages, ['english']),
          subtitles: getIds(languages, ['english', 'german']),
        },
        rating: 4,
        playMode: 'singleplayer',
        trailerUrl: 'https://www.youtube.com/watch?v=Qjy4KjcJZLc',
        pegi: '18',
      },
      {
        title: 'Super Mario Odyssey',
        coverImage: '/assets/games/Super Mario Odyssey-Cover.jpg',
        description: '3D platformer featuring Mario exploring new worlds.',
        producer: 'Nintendo',
        category: getIds(categories, ['Platformer', 'Adventure']),
        releaseDate: new Date('2017-10-27'),
        platforms: getIds(platforms, ['Nintendo Switch']),
        genre: getIds(genres, ['Platformer', 'Adventure']),
        languages: {
          interface: getIds(languages, ['english', 'italian']),
          audio: getIds(languages, ['english']),
          subtitles: getIds(languages, ['english', 'italian']),
        },
        rating: 5,
        playMode: 'singleplayer',
        trailerUrl: 'https://www.youtube.com/watch?v=5kcdRBHM7kM',
        pegi: '7',
      },
      {
        title: 'The Legend of Zelda: Breath of the Wild',
        coverImage: '/assets/games/The Legend of Zelda-Breath of the Wild-Cover.jpg',
        description: 'Open-world action-adventure game on Nintendo Switch and Wii U.',
        producer: 'Nintendo',
        category: getIds(categories, ['Adventure', 'Action']),
        releaseDate: new Date('2017-03-03'),
        platforms: getIds(platforms, ['Nintendo Switch', 'Nintendo Wii U']),
        genre: getIds(genres, ['Adventure', 'Action']),
        languages: {
          interface: getIds(languages, ['english', 'japanese', 'french', 'german']),
          audio: getIds(languages, ['japanese']),
          subtitles: getIds(languages, ['english', 'french', 'german']),
        },
        rating: 5,
        playMode: 'singleplayer',
        trailerUrl: 'https://www.youtube.com/watch?v=1rPxiXXxftE',
        pegi: '12',
      },
      {
        title: 'Witcher 3',
        coverImage: '/assets/games/Witcher 3-Cover.jpg',
        description: 'Open-world RPG with rich story and characters.',
        producer: 'CD Projekt Red',
        category: getIds(categories, ['RPG', 'Adventure']),
        releaseDate: new Date('2015-05-19'),
        platforms: getIds(platforms, ['PC', 'PlayStation 4', 'Xbox One']),
        genre: getIds(genres, ['Role-Playing Game (RPG)', 'Adventure']),
        languages: {
          interface: getIds(languages, ['english', 'polish', 'german']),
          audio: getIds(languages, ['english']),
          subtitles: getIds(languages, ['english', 'polish', 'german']),
        },
        rating: 5,
        playMode: 'singleplayer',
        trailerUrl: 'https://www.youtube.com/watch?v=c0i88t0Kacs',
        pegi: '18',
      },
      {
        title: 'Ghost of Tsushima',
        coverImage: '/assets/games/Ghost of Tsushima-Cover.jpg',
        description: 'Open-world samurai action-adventure.',
        producer: 'Sucker Punch Productions',
        category: getIds(categories, ['Action', 'Adventure']),
        releaseDate: new Date('2020-07-17'),
        platforms: getIds(platforms, ['PlayStation 4']),
        genre: getIds(genres, ['Action', 'Adventure']),
        languages: {
          interface: getIds(languages, ['english', 'japanese']),
          audio: getIds(languages, ['english', 'japanese']),
          subtitles: getIds(languages, ['english']),
        },
        rating: 5,
        playMode: 'singleplayer',
        trailerUrl: 'https://www.youtube.com/watch?v=GzUo5NNVQdA',
        pegi: '18',
      },
      {
        title: 'FIFA 23',
        coverImage: '/assets/games/FIFA 23-Cover.jpg',
        description: 'Latest installment in the FIFA series.',
        producer: 'EA Sports',
        category: getIds(categories, ['Sports']),
        releaseDate: new Date('2022-09-27'),
        platforms: getIds(platforms, ['PC', 'PlayStation 5', 'Xbox Series X/S']),
        genre: getIds(genres, ['Sports']),
        languages: {
          interface: getIds(languages, ['english', 'spanish', 'french']),
          audio: getIds(languages, ['english']),
          subtitles: getIds(languages, ['english', 'spanish', 'french']),
        },
        rating: 4,
        playMode: 'multiplayer',
        trailerUrl: 'https://www.youtube.com/watch?v=6M12cMKHeA4',
        pegi: '3',
      },
      {
        title: 'Animal Crossing: New Horizons',
        coverImage: '/assets/games/Animal Crossing-New Horizons-Cover.jpg',
        description: 'Life simulation game on Nintendo Switch.',
        producer: 'Nintendo',
        category: getIds(categories, ['Simulation', 'Casual']),
        releaseDate: new Date('2020-03-20'),
        platforms: getIds(platforms, ['Nintendo Switch']),
        genre: getIds(genres, ['Simulation', 'Casual']),
        languages: {
          interface: getIds(languages, ['english', 'japanese']),
          audio: getIds(languages, []),
          subtitles: getIds(languages, ['english']),
        },
        rating: 4,
        playMode: 'singleplayer',
        trailerUrl: 'https://www.youtube.com/watch?v=5U3apllFiP0',
        pegi: '3',
      },
    ];

    for (const gameData of gamesData) {
      const exists = await Game.findOne({ title: gameData.title });
      if (exists) {
        console.log(`Gioco già presente: ${gameData.title}, aggiornamento dati...`);
        await Game.updateOne({ _id: exists._id }, gameData);
      } else {
        const newGame = new Game(gameData);
        await newGame.save();
        console.log(`Inserito gioco: ${gameData.title}`);
      }
    }

    console.log('Seed giochi completato');
  } catch (error) {
    console.error('Errore nel reset & seeding giochi:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seedGames();
