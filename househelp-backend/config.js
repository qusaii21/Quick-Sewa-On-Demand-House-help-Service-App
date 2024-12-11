// config.js
module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb+srv://kriyaoswal:admin@cluster0.cfjlf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    jwtSecret: process.env.JWT_SECRET || 'my$uperSecr3tJWTKey#2024!randomValue^*&!@longkey'
  };
  