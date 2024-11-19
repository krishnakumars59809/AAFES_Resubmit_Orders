import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const { ORDERS_BASE_API_URL } = process.env;
const token = 'Z0haceQC4CVExZzn4bCFcwj4PSwJPSTM'
// Function to fetch orders based on order numbers and categorize them into success and failed
const getResubmitOrders = async (orderNumbers) => {
    // Build the where clause for the API request based on the order numbers
    let whereClause = orderNumbers?.map(num => `orderNumber=${num}`).join(' OR ');
    let config = {
        method: 'get',
        maxBodyLength: Infinity, // Ensures the response body can be as large as necessary
        url: `${ORDERS_BASE_API_URL}?where=${whereClause}`, 
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
        },
    };
    // Arrays to store success and failed orders
    const successOrders = [];
    const failedOrders = [];

    try {
        // Make the GET request to fetch the orders
        const response = await axios.request(config);
        const orders = response?.data?.results;

        // If orders are returned, push their id, version, and orderNumber into the successOrders array
        if (orders?.length > 0) {
            orders.forEach(order => {
                successOrders.push({
                    id: order?.id,
                    version: order?.version,
                    orderNumber: parseInt(order?.orderNumber)
                });
            });
        }

        // Filter out the order numbers that were successfully fetched, and categorize the remaining ones as failed
        const successOrderNumbers = successOrders?.map(order => order.orderNumber);
        const failedOrderNumbers = orderNumbers?.filter(num => !successOrderNumbers.includes(num));
        failedOrders.push(...failedOrderNumbers); // Push failed order numbers to the failedOrders array
    } catch (error) {
        // Handle any errors (e.g., network issues) and add all order numbers to the failedOrders array
        console.error("GET RESUBMIT ORDERS ERROR:", error);
        failedOrders.push(...orderNumbers);
    }

    // Return the successfully fetched orders and the failed orders
    return { 
        successOrders: successOrders?.filter(o => !failedOrders.includes(o.orderNumber)), // Filter out failed orders from success
        failedOrders 
    };
};

// Function to update the state of the orders to "Open"
const changeOrderState = async (orderNumbers) => {
    const { successOrders, failedOrders } = await getResubmitOrders(orderNumbers);

    // Arrays to store the order numbers that are successfully updated and failed updates
    const updateSuccess = [];
    const updateFailed = [...failedOrders]; // Initialize with failed orders fetched earlier

    // Process each order in the successOrders array
    const requests = successOrders.map(async (order) => {
        let data = JSON.stringify({
            "version": order?.version, 
            "actions": [
                {
                    "action": "changeOrderState",
                    "orderState": "Open" // The action to change the order state to "Open"
                }
            ]
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${ORDERS_BASE_API_URL}/${order?.id}`,
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}` 
            },
            data: data 
        };

        try {
            await axios.request(config);
            updateSuccess.push(order.orderNumber); // If successful, push the order number to success array
        } catch (error) {
            // If the request fails, log the error and push the order number to failed array
            console.error("Failed to update order state:", order.orderNumber, error);
            updateFailed.push(order.orderNumber);
        }
    });

    // Wait for all requests to complete before proceeding
    await Promise.all(requests);

    // Remove any duplicates between success and failed order numbers
    return {
        success: updateSuccess,
        failed: updateFailed?.filter(num => !updateSuccess.includes(num)),
    };
};

// Main function to execute the state change logic
export const execute = async (orderNumbers) => {
    const startTime = Date.now(); // Capture start time for the entire `changeOrderState` process
    console.log("Starting changeOrderState.....");
    console.log("RESUBMIT ORDERS", await changeOrderState(orderNumbers)); // Call changeOrderState and log the result
    const endTime = Date.now(); // Capture end time after the function has finished
    console.log("Total Execution Time for changeOrderState:",`${endTime - startTime}ms`)
    console.log(`Finished.`); // Log total execution time
};
