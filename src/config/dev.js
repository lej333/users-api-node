module.exports = {
  env: 'development',

  application: {
    name: 'Vacancies API'
  },

  server: {
    host: 'localhost',
    port: 8001,
    cors: true
  },

  security: {
    jwt: {
      expiration: '1d'
    },
    password: {
      min: 8,
      max: 250,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1
    }
  },

  mongoDb: {
    options: {
      useNewUrlParser: true,
      useFindAndModify: false,
      authSource: 'admin',
      retryWrites: true,
      ssl: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  }
};
