import { execute } from "./src/ResubmitOrder.js";
import { successOrders } from "./src/SuccessOrders.js";

const orderNumbers = [
  6720659981, 6720660052, 6720660169, 6720660283, 6720660460,
  6720655869, 6720661188, 6720661589, 6720661869, 6720662495
]; // Example order numbers

const filteredOrderNumbers = orderNumbers.filter(orderNumber => {
  return successOrders.some(order => order === orderNumber);
});
console.log("NUMBER OF ORDER NUMBERS:", orderNumbers?.length)
console.log("NUMBER OF FILTERED ORDER NUMBERS:", filteredOrderNumbers?.length)

if (filteredOrderNumbers?.length > 0) {
  execute(filteredOrderNumbers)
} else {
  console.log("PLEASE TRY NEW ORDERS!!!!")
}

