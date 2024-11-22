import { execute } from "./src/ResubmitOrder.js";
import { successOrders } from "./src/SuccessOrders.js";

const orderNumbers = [
  6720734170, 672074334364, 6720735321, 6720736488,6720732365,
  6720738242, 6720739065, 6720434741295, 6720741660, 6720741672
]; // Example order numbers

const filteredOrderNumbers = orderNumbers.filter(orderNumber => {
  return !successOrders.some(order => order === orderNumber);
});
console.log("NUMBER OF ORDER NUMBERS:", orderNumbers?.length)
console.log("NUMBER OF FILTERED ORDER NUMBERS:", filteredOrderNumbers?.length)

const isResubmit = true

if (filteredOrderNumbers?.length > 0) {
  execute(filteredOrderNumbers, isResubmit)
} else {
  console.log("PLEASE TRY NEW ORDERS!!!!")
}

