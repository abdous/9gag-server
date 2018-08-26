// question on upvoting(downvote) a joke .



//
//  server.post('/update/joke/upvote', (Request, Response) => {
//      const {body} = Request;
    
//      if (body){
//          const {id } = body;
//          if (id){
//             const sql = "update joke set up_votes = up_votes + 1 where id = ?" ;
        
            
//          const value = [id];
//          connection.query(sql, value, (Error, results) => {
//              if (Error){
//                  showError( error, Response);
//              }
//              Response.json({ status: "succes", message: " joke upvote"}) 
//              //console.log(results);
//          })    
//          }
//      }
//      //console.log(Request);
//      //Response.send("update joke will come here");
//  });
//  function showError(error,Response){
//      console.log(error);
//      Response.json({status: "error", message: "something went wrong"});
//}
//});



server.post("/update/joke/:votes", vote);

function vote(req, res) {
  const {
    body
  } = req;
  if (body) {
    const {
      id
    } = body;
    if (id) {
      let table = "";
      if (req.params.votes === "upvote") {
        table = "up_votes = up_votes + 1";
      } else if (req.params.votes === "downvote") {
        table = "down_votes = down_votes + 1";
      }
      const sql = `update joke set ${table} where id = ?`;
      const values = [id];
      connection.query(sql, values, (error, results) => {
        if (error) {
          showError(error, res);
        }
        console.log(results);
        res.json({
          status: "succes",
          message: "Joke vote updated"
        });
      });
    }
  }
}

function showError(error, res) {
  console.log(error);
  res.json({
    status: "error",
    message: "Something went wrong"
  });
}