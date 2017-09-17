var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "suman1713",
  database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  displaytable();
  console.log("");
  sale_start();

});

// function which prompts the user for what action they should take
function sale_start() {
  inquirer
    .prompt([{
      name: "buy_customer",
      type: "input",
      message: "Enter the item id for the item you want to  buy: ",
    },{
      name: "buy_customernum",
      type: "input",
      message: "Enter the number of items: ",

    }])

    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (parseInt(answer.buy_customer)<11) {
      	console.log("You bought the following item: ");
      	displayrow(answer.buy_customer);
      	connection.query("SELECT * FROM products where ?",{item_id:answer.buy_customer}, function(err, res) {
      		
   			if(parseInt(res[0].stock_quantity)<answer.buy_customernum){
   				console.log("SORRY INSUFFICIENT STOCK");
   				console.log("TRY AGAIN");
   				sale_start();
   			}else{
   				
   				var update=parseInt(res[0].stock_quantity)-answer.buy_customernum;
   				var totalcost=answer.buy_customernum*parseInt(res[0].Price);
   				//console.log(update);
   				console.log("YOUR TOTAL COST: "+totalcost);
   				console.log("THANK YOU");
   				updatedb(answer.buy_customer,update);

   			}	
        
      	})

      }
      else {
      	console.log("Wrong Choice!!! TRY AGAIN");
      	sale_start();

      }
    });
}

function displaytable(){
	 connection.query("SELECT * FROM products", function(err, res) {
	 	console.log("\n");
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].ProductName + " | " + res[i].Price + " | "+res[i].stock_quantity );
    }
    console.log("-----------------------------------");
  });
}
function displayrow(row){
	connection.query("SELECT * FROM products where ?",{item_id:row}, function(err, res) {
	 	console.log("\n");
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].ProductName + " | " + res[i].Price + " | " );
    }

});
}
function updatedb(row,newquantity){
	connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity:newquantity},{item_id:row}], function(err, res) {
		console.log("DATABASE UPDATED!!!");
	 
  });

}