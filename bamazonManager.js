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
  askManager();
  // run the start function after the connection is made to prompt the user
 

});
function askManager() {
    inquirer.prompt([
        {
            type: "list", 
            message: "------!!WELCOME!!-------", 
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory","Add New Product","EXIT"], 
            name: "askManager"   
        }
    ]).then(function (answer) {
      var waitMsg;

      switch (answer.askManager) {
      	case 'View Products for Sale':
              console.log("View Products for Sale");
              displaytable();
              waitMsg = setTimeout(askManager, 1000);
              
              break;

      	case 'View Low Inventory':
              console.log("View Low Inventory");
              low_inventory();
              waitMsg = setTimeout(askManager, 1000);
              break;
  
          case 'Add to Inventory':
              console.log("Add to Inventory");
              add_inventory();

              break;
  
          case 'Add New Product':
              console.log("Add New Product");
              add_product();
              break;
  
          case 'EXIT':
              return;
              
              break;
  
          default:
              console.log("Try again.");
      }
    });
  }
/*
// function which prompts the user for what action they should take
function sale_start() {
  inquirer
    .prompt([{
      name: "view_products",
      type: "list",
      message: "View Products for Sale",
    },{
      name: "low_inventory",
      type: "list",
      message: "View Low Inventory",
    },{
      name: "add_inventory",
      type: "list",
      message: "Add to Inventory",
    },{
      name: "add_product",
      type: "list",
      message: "Add New Product",
    }
    ])

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
*/
function displaytable(){
	 connection.query("SELECT * FROM products", function(err, res) {
	 	console.log("\n");
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].ProductName + " | " + res[i].Price + " | "+res[i].stock_quantity );
    }
    console.log("-----------------------------------");
  });
}

function low_inventory(){
	connection.query("SELECT * FROM products where stock_quantity < ?",[5000], function(err, res) {
	 	console.log("\n");
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].ProductName + " | " + res[i].stock_quantity + " | " );
    }

});
}

function add_inventory(){
	inquirer
    .prompt([{
      name: "add_itemid",
      type: "input",
      message: "Enter the item id to add: ",
    },{
      name: "add_itemnum",
      type: "input",
      message: "Enter the number of items to add: ",

    }])

    .then(function (answer) {
    	 
    connection.query("UPDATE products SET stock_quantity=stock_quantity+? WHERE ?",[answer.add_itemnum,{item_id:answer.add_itemid}], function(err, res) {
		console.log("DATABASE UPDATED!!!");
		waitMsg = setTimeout(displaytable, 1000);
		waitMsg = setTimeout(askManager, 2000);
	 
  });
     
    });

}

function add_product(){
	inquirer
    .prompt([{
      name: "add_itemname",
      type: "input",
      message: "Enter the item name: ",
    },{
      name: "add_itemcategory",
      type: "input",
      message: "Enter the category of item: ",

    },{
      name: "add_itemprice",
      type: "input",
      message: "Enter the price of item: ",

    },{
      name: "add_itemnumber",
      type: "input",
      message: "Enter the number of items to add in stock: ",

    }])

    .then(function (answer) {
    connection.query("INSERT INTO products(ProductName,Department, Price, stock_quantity) values(?,?,?,?)",[answer.add_itemname,answer.add_itemcategory,answer.add_itemprice,answer.add_itemnumber], function(err, res) {
		console.log("DATABASE UPDATED!!!");
		waitMsg = setTimeout(displaytable, 1000);
	 
  });
     
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