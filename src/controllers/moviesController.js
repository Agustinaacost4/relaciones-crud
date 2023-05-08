const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const { error } = require('console');


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        const AllGenres = db.Genre.findAll()
        Promise.all([AllGenres])
        .then(([AllGenres])=>{
        return res.render('moviesAdd',{AllGenres})
        })
        .catch(error=>{console.log(error)})
        
    },
    create: function (req,res) {
        const {title,rating,awards,release_date,length,genre_id} = req.body
        db.Movie.create({
            title,
            rating,
            awards,
            release_date,
            length,
            genre_id

        })
        .then(()=>{
            res.redirect('/movies')
        })
        .catch(error=>{console.log(error)})

    },
    edit: function(req,res) {
        const findMovie = db.Movie.findByPk(req.params.id)
         const todosLosGeneros = db.Genre.findAll()
         Promise.all([findMovie, todosLosGeneros])
            .then(([findMovie, todosLosGeneros]) => {
                return res.render("moviesEdit", {
                    Movie: {
                        ...findMovie.dataValues,
                        release_date: findMovie.release_date.toISOString().split("T")[0],
                    },
                    todosLosGeneros,
                    title: "Edicion",
                });
            })
            .catch((error) => console.log(error));


    },
    update: function (req,res) {
  db.Movie.update(
    {
        ...req.body
    },
    {where:{
        id: req.params.id
    }}

  ) .then(()=>res.redirect('/movies/detail/'+ req.params.id))
  .catch(error => console.log(error))

    },
    delete: function (req,res) {
        db.Movie.findByPk(req.params.id)
        .then(movie =>{
            return res.render('moviesDelete', {Movie:movie});
        })
        .catch(error => console.log(error))

    },
    destroy: function (req,res) {
        db.Movie.destroy({
            where:{
                id:req.params.id
            }
        })
        .then(()=> res.redirect('/movies'))
        .catch(error => console.log(error))

    }
}

module.exports = moviesController;