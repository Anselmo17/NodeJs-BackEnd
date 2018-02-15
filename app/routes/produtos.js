
module.exports = function(app) {
    app.get('/produtos', function(req, res, next) {

        var connection = app.infra.connectionFactory();
        var produtosDAO = new app.infra.produtosBanco(connection);

        //função callback trazendo erro e resultados
        produtosDAO.lista( function(erros, resultados) {
            if(erros){
                return next (erros);
            }
            res.format  ({
                    html:function(){
                            //renderiza a lista na tela 
                        res.status(400).render('produtos/lista', {lista: resultados});

                       //mostrar resultados em json
                      //res.json(results);
                    },
                    json:function(){
                        res.status(400).json(erros);
                    }

            });
       })
           
        //fechando a conexão
        connection.end();
    });


    //renderizando o html da página form 
    app.get('/produtos/form',function(req,res){
        res.render('produtos/form',
                {errosValidacao:{},produto:{}});
    });

    //postando os livros no banco de dados 
    app.post("/produtos", function(req, res){

        var produto = req.body;

         req.assert("titulo","Título é obrigatório").notEmpty();
         req.assert('preco','Formato inválido').isFloat();

        
        //mostra erros dos campos
        var errors = req.validationErrors();
      
      
        if(errors){
            res.render('produtos/form',{errosValidacao : errors,produto:produto});
            return;
        }
        

        var connection = app.infra.connectionFactory();
        var produtosDAO = new app.infra.ProdutosDAO(connection);

        produtosDAO.salva(produto, function(erros,resultados){
            produtosDAO.lista(function(erros, resultados){

                //redireciona para produtos
                res.redirect("/produtos");
            })
            
        });

    })

    app.get('produtos/remove', function(){

        var connection = app.infra.connectionFactory();
        var produtosBanco = app.infra.produtosBanco;
        var produto = produtosBanco.carrega( id , callback);
        if(produto){
            produtosBanco.remove(produto, callback);
        }
    });
}
