var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator'); 
 
module.exports = function() {
    var app = express();

    app.use(express.static('./app/public'));
    app.set('view engine', 'ejs');
    app.set('views', './app/views');
    

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(expressValidator());

    //pastas a serem carregadas
    load('routes', {cwd: 'app'})
        .then('infra')
        .into(app);

    //funcão quando a pagina não existir 
    app.use(function(req, res,next){
        res.status(404).render('erros/404');
        next();
    });

     //funcão quando a pagina não existir 
     app.use(function(error , req, res,next){
         if(process.env.NODE_ENV == 'production'){
            res.status(500).render('erros/500');
            return ; 
         }
        next(error);
    });

    return app;
}
