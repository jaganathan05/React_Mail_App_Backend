const Express = require('express');
const cors = require('cors');
const app = Express();
const sequelize = require('./Helper/database')

app.use(Express.json());
app.use(cors({
  origin:'*'
}));

// Routes 
const UserRoutes = require('./Router/User_router')

//models 
const User = require('./Models/User_model')
const AllMails = require('./Models/AllMails')

app.use(UserRoutes);

//relation between tables 
User.hasMany(AllMails)
AllMails.belongsTo(User)

sequelize.sync({force : false}).then(() => {
  app.listen(4000)
  console.log('Database synchronized');
});