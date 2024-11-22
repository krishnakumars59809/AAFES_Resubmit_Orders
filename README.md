
// How to Run the Script
** npm install

Add the order IDs that need their order state changed in the run.js file.
Generate a token using Postman (based on the environment) and add it to the .env file.

** node run.js


//Post-Execution Steps
Once the script completes execution, take the success order values from the output logs.
Store these values in a SuccessOrders.js file

// Case 1: All Orders Success
NUMBER OF ORDER NUMBERS: 10
NUMBER OF FILTERED ORDER NUMBERS: 10
Starting changeOrderState.....
WhereClause ((orderState="Confirmed") AND (orderNumber=6720734170 OR orderNumber=6720734364 OR orderNumber=6720735321 OR orderNumber=6720736488 OR orderNumber=6720732365 OR orderNumber=6720738242 OR orderNumber=6720739065 OR orderNumber=6720741295 OR orderNumber=6720741660 OR orderNumber=6720741672))
NUMBER OF PROCESSING ORDER IDS: 10
NUMBER OF PROCESSING FAILED ORDER IDS: 0
State Updating......>.....>...>
State Updating......>.....>...>
State Updating......>.....>...>
State Updating......>.....>...>
State Updating......>.....>...>
State Updating......>.....>...>
State Updating......>.....>...>
State Updating......>.....>...>
State Updating......>.....>...>
State Updating......>.....>...>
RESUBMIT ORDERS {
  success: [
    6720732365, 6720734170,
    6720734364, 6720735321,
    6720736488, 6720738242,
    6720739065, 6720741295,
    6720741660, 6720741672
  ],
  failed: [],
  isSameOrderNumbers: true,
  NumberOfSuccess: 10,
  NumberOfFailed: 0
}
Total Execution Time for changeOrderState: 549ms
Finished.


Case 2: Mixed Success and Failed Orders

NUMBER OF ORDER NUMBERS: 10
NUMBER OF FILTERED ORDER NUMBERS: 10
Starting changeOrderState.....
WhereClause ((orderState="Confirmed") AND (orderNumber=6720734170 OR orderNumber=672074334364 OR orderNumber=6720735321 OR orderNumber=6720736488 OR orderNumber=6720732365 OR orderNumber=6720738242 OR orderNumber=6720739065 OR orderNumber=6720434741295 OR orderNumber=6720741660 OR orderNumber=6720741672))
NUMBER OF PROCESSING ORDER IDS: 8
NUMBER OF PROCESSING FAILED ORDER IDS: 2
State Updating......>.....>...>
State Updating......>.....>...>
State Updating......>.....>...>
State Updating......>.....>...>
State Updating......>.....>...>
State Updating......>.....>...>
State Updating......>.....>...>
State Updating......>.....>...>
RESUBMIT ORDERS {
  success: [
    6720732365,
    6720734170,
    6720735321,
    6720736488,
    6720738242,
    6720739065,
    6720741660,
    6720741672
  ],
  failed: [ 672074334364, 6720434741295 ],
  isSameOrderNumbers: true,
  NumberOfSuccess: 8,
  NumberOfFailed: 2
}
Total Execution Time for changeOrderState: 571ms
Finished.