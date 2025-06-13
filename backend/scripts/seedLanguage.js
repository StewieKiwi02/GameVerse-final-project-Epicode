require('dotenv').config();
const mongoose = require('mongoose');
const Language = require('../models/Language');

const languages = [
  { name: 'english', isoCode: 'EN' },
  { name: 'italian', isoCode: 'IT' },
  { name: 'spanish', isoCode: 'ES' },
  { name: 'french', isoCode: 'FR' },
  { name: 'german', isoCode: 'DE' },
  { name: 'portuguese', isoCode: 'PT' },
  { name: 'russian', isoCode: 'RU' },
  { name: 'japanese', isoCode: 'JA' },
  { name: 'chinese', isoCode: 'ZH' },
  { name: 'korean', isoCode: 'KO' },
  { name: 'arabic', isoCode: 'AR' },
  { name: 'dutch', isoCode: 'NL' },
  { name: 'swedish', isoCode: 'SV' },
  { name: 'norwegian', isoCode: 'NO' },
  { name: 'polish', isoCode: 'PL' },
  { name: 'turkish', isoCode: 'TR' },
  { name: 'thai', isoCode: 'TH' },
  { name: 'czech', isoCode: 'CS' },
  { name: 'hungarian', isoCode: 'HU' },
  { name: 'finnish', isoCode: 'FI' },
  { name: 'romanian', isoCode: 'RO' },
  { name: 'greek', isoCode: 'EL' },
];

const seedLanguages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connesso al database per il seeding delle lingue');

    // Pulizia della collection per evitare duplicati
    await Language.deleteMany({});

    await Language.insertMany(languages);
    console.log('Lingue inserite con successo!');
  } catch (error) {
    console.error('Errore nel seeding delle lingue:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

seedLanguages();
