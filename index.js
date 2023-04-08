// app.js
const express = require('express');
require('dotenv').config()
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ot3inhk.mongodb.net/?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to the database!');
}).catch((err) => {
  console.error('Error connecting to the database:', err.message);
});

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.render('index', { recipes });
  } catch (err) {
    console.error('Error getting recipes:', err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/new', async (req, res) => {
  try {
    const recipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients
    });
    await recipe.save();
    res.redirect('/');
  } catch (err) {
    console.error('Error creating recipe:', err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/:id/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.render('edit', { recipe });
  } catch (err) {
    console.error('Error getting recipe:', err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/:id/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    recipe.name = req.body.name;
    recipe.description = req.body.description;
    recipe.ingredients = req.body.ingredients;
    await recipe.save();
    res.redirect('/');
  } catch (err) {
    console.error('Error updating recipe:', err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/:id/delete', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error('Error deleting recipe:', err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
