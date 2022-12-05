const express = require("express")
const mysql = require("mysql")
const { uniqueNamesGenerator, starWars } = require('unique-names-generator');


const conf = {
   "host": "db",
   "user": "root",
   "password": "root",
   "database": "nodedb"
}

const app = express()



async function insertDB()
{
  let connection =  mysql.createConnection(conf);
  let randomName = uniqueNamesGenerator({ dictionaries: [starWars] });
  let sql = `INSERT INTO peaple(name) values('${randomName}')`
  await connection.query(sql);
  connection.end()
}
async function list(){
  let connection =  mysql.createConnection(conf);
  return new Promise(function(resolve, reject){
    connection.query('SELECT * FROM peaple;', function(error, results, fields){
      if (error) {
        connection.end()
        throw error;
      }
      let html = "<ul>";
      for(let i =0; i < results.length; i++){
        html += `<li>${results[i]['id']} - ${results[i]['name']}</li>`
      }
      html += "</ul>";
      resolve(html);
    });
  });
  
}
app.get('/', async (req, res) => {
  try{
  
    await insertDB();
    let html = await list();
    res.send("<h1>Full Cycle Rocks!</h1><br>"+html)
  }catch(e){
    console.log(e);
    res.send(`<h1>Error de conexão com banco de dados: ${e}</h1>`)
  }
})

app.listen(3000, () => {
  console.log("Server run at http://localhost:3000 ")
})