const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const {connection} = require("./Connection");
const fs = require("fs");
const uuidv4 = require("uuid/v4");
const server = express();
const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log(`server is running on localhost: ${port}`);
});

server.use(express.static("public"));
server.use(bodyParser.json());
server.use(cors({ origin: "http://localhost:3000"}));
server.use(compression());
server.use(helmet());

server.get("/", (Request, Response) => {
    Response.send("you are on my master branch");

});

server.get("/password", (Request, Response) =>{
    const stupidPassword = "password123";
    const hashedPassword = SHA256(stupidPassword);
    console.log({hashedPassword});
})

// selection of the full table jokes by desc order.
server.get("/get/jokes", (Request, Response) =>{
    connection.query("select * from joke order by id desc", (Error,results) =>{
        if (Error){
            console.log(Error);;
            Response.json({status: "error" , message: " something went wrong"});
        }
        Response.json(results);
    });

});
// question on uploading a joke using post methode.

server.post("/post/joke", (Request, Response) =>{
    const {body} = Request;
    if ( body){
        const {title, file} = body;
        console.log({title, file});
        if (file){
            const {base64} = file;
            const fileName = uuidv4();
            fs.writeFile("./public/images/${fileName}.jpeg", base64, 'base64', (error)=> {
                if(error){
                    console.log(error)
            }
        });
        const sql = "insert into joke set?";
        const values = {
            image_location : `./image/${fileName}.jpeg`,
            title
        };
        connection.query(sql, values, (error,results) =>{
            if (error){
                showError(error);
                
            } else{
                console.log(results);
            Response.json({
                status: "succes",
                message: "joke uploaded"
                    });
                }
    
            });
        }
    }
});


// question on getting a single joke based on the id [1].
server.get("/get/joke/:id", (Request, Response) =>{
    const sql = "SELECT * FROM joke where id =?";
    const values = [Request.params.id];
    connection.query(sql, values, (Error,results) =>{
        if (Error){
            showError(error, Response);
            
        }
        Response.json(results[1]);
    });
});

// getting comments per joke.
server.get("/get/comments/:jokeId", (Request, Response) =>{
    const {body} = Request;
    if (body){
    const sql = "SELECT * FROM comment  where joke_id =?";
    const values = [Request.params.jokeId];
    connection.query(sql, values, (Error,results) =>{
        if (Error){
            showError(error, Response);
            
        }
        Response.json(results);
    });
}
});

// posting a comment.

server.post("/post/comment", (Request, Response) => {
    const {
      body
    } = Request;
    if (body) {
      const {
        text,
        username,
        joke_id
      } = body;
      const sql = "INSERT INTO comment SET text = ?, username = ?, joke_id = ?";
      const values = [text, username, joke_id];
      connection.query(sql, values, (error, results) => {
        if (error) {
          showError(error, Response);
        }
        console.log(results);
        res.json({
          status: "succes",
          message: "comment posted"
        });
      });
    }
  });

  function showError(error, res) {
    console.log(error);
    res.json({
      status: "error",
      message: "Something went wrong"
    });
  }