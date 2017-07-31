var mysql = require('mysql');
var inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {

  if (err) throw err;
  console.log("Connected!"); 
  start ();
 
});

var requested_item_id;
var requested_unit_number;
var item_price;
var current_unit_number;


function start() {
   console.log("Showing current inventory...\n");
   connection.query("SELECT * from products", function(err, res) {
   if (err) throw err;
   // Log all results of the SELECT statement
   console.log(res);

   inquirer.prompt([
    {type: 'input',
    name: 'user_item_id',
    message: "Enter item ID of product you'd like to buy"
    },
    {type: 'input',
    name: 'user_unit_number',
    message: "How many units would you like to buy?"
    }
    ]).then(function (data) {
    console.log(data);
    console.log(data['user_item_id']);
    requested_item_id = data['user_item_id'];
    console.log(data['user_unit_number']);
    requested_unit_number = data['user_unit_number'];
    check_stock();

  

    });
  });
}


function check_stock() {

connection.query('SELECT price as item_price FROM products WHERE item_id =?', [requested_item_id], function(err, res) {
     if (err) throw err;
     console.log("price pet unit is: "+ res[0].item_price)
     item_price = res[0].item_price;
    });

connection.query('SELECT stock_quantity as quantity FROM products WHERE item_id =?', [requested_item_id], function(err, res) {
   // Log all results of the SELECT statement
     
     if (err) throw err;
     console.log(res[0].quantity);
     current_unit_number = res[0].quantity;
     console.log("THIS IS THE CURRENT UNIT NUMBER "+current_unit_number)
     console.log("THIS IS THE REQUESTED UNIT NUMBER "+requested_unit_number)

   
      if (requested_unit_number > current_unit_number) {
      console.log("Sorry, too few in stock!")
      }

      else  {

        // var total_cost = 1 * parseInt(item_price) * parseInt(requested_unit_number);
        // console.log("hello " + total_cost);

           
      connection.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id =?',[requested_unit_number, requested_item_id], function (err, res) {
      if (err) throw err;

      var x = requested_unit_number*item_price;
      console.log("You got it!" +'\n' + "You requested: "+ requested_unit_number + " of this item." + '\n' + "price per item is: "+ item_price + '\n' + "Your total cost is: "+ x +" dollars");
      
      });

    }

  });



}

    








// function getAllArtists() {
//    console.log("Selecting all products...\n");
//    connection.query("SELECT artist_name, COUNT(*) c FROM Top5000 GROUP BY artist_name HAVING c > 1;", function(err, res) {
//        if (err) throw err;
//        // Log all results of the SELECT statement
//        console.log(res);
//        connection.end();
//    });
// }


// function getDataByRange() {
//    console.log("Selecting all products...\n");
//    connection.query("select * from Top5000 where id between '2' and '5' order by id desc;", function(err, res) {
//        if (err) throw err;
//        // Log all results of the SELECT statement
//        console.log(res);
//        connection.end();
//    });
// }


// function getDataBySong() {
//    console.log("Selecting all products...\n");
//    connection.query("select * from Top5000 where song = 'Like a Virgin';", function(err, res) {
//        if (err) throw err;
//        // Log all results of the SELECT statement
//        console.log(res);
//        connection.end();
//    });
// }