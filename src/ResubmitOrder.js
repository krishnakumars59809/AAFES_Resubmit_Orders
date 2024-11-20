import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const { ORDERS_BASE_API_URL } = process.env;
// const token = 'AROv-Xxw9Zs7QPb7FPP3ddqLW9K1aDRF'
const token = '-0f-T5pxdVqDVB0jvYy_LmipFRa1cDrm'
// Function to fetch orders based on order numbers and categorize them into success and failed
const getResubmitOrders = async (orderNumbers) => {
    const limit = 500; // Define the maximum number of items per request

    // Build the where clause for the API request based on the order numbers
    let whereClause = orderNumbers?.map(num => `orderNumber=${num}`).join(' OR ');
    whereClause = `((orderState="Confirmed") AND (${whereClause}))`
    // Arrays to store success and failed orders
    const successOrders = [];
    const failedOrders = [];
    try {
        // Build the API URL with limit and offset
        const url = `${ORDERS_BASE_API_URL}?where=${whereClause}&limit=${limit}`;
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        // Make the GET request to fetch the orders
        const response = await axios.request(config);
        const orders = response?.data?.results;

        // If orders are returned, push their id, version, and orderNumber into the successOrders array
        if (orders?.length > 0) {
            orders?.forEach(order => {
                successOrders.push({
                    id: order?.id,
                    version: order?.version,
                    orderNumber: parseInt(order?.orderNumber),
                });
            });
        }

        // Filter out the order numbers that were successfully fetched, and categorize the remaining ones as failed
        const successOrderNumbers = successOrders?.map(order => order?.orderNumber);
        const failedOrderNumbers = orderNumbers?.filter(num => !successOrderNumbers?.includes(num));
        failedOrders.push(...failedOrderNumbers); // Push failed order numbers to the failedOrders array
    } catch (error) {
        // Handle any errors (e.g., network issues) and add all order numbers to the failedOrders array
        console.log("GET RESUBMIT ORDERS API ERROR:", error?.response?.data);
        failedOrders.push(...orderNumbers);
    }

    // Return the successfully fetched orders and the failed orders
    return {
        successOrders: successOrders?.filter(successOrder => !failedOrders?.includes(successOrder.orderNumber)), // Filter out failed orders from success
        failedOrders,
    };
};


// Function to update the state of the orders to "Open"
const changeOrderState = async (orderNumbers) => {
    const { successOrders, failedOrders } = await getResubmitOrders(orderNumbers);
    console.log("NUMBER OF PROCESSING ORDER IDS:", successOrders?.length);
    console.log("NUMBER OF PROCESSING FAILED ORDER IDS:", failedOrders?.length);

    // Arrays to store the order numbers that are successfully updated and failed updates
    const updateSuccess = [];
    const updateFailed = [...failedOrders]; // Initialize with failed orders fetched earlier

    // Helper function to process orders in batches
    const processBatch = async (batch) => {
        const requests = batch.map(async (order) => {
            let data = JSON.stringify({
                "version": order?.version,
                "actions": [
                    {
                        "action": "changeOrderState",
                        "orderState": "Open"
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
                console.error("ORDER STATE UPDATE API ERROR:", order.orderNumber, error?.response?.data);
                updateFailed.push(order.orderNumber);
            }
        });

        // Wait for all requests in the batch to complete
        await Promise.all(requests);
    };

    // Process orders in batches of 25
    const batchSize = 25;
    const batches = [];
    // Create batches of orders
    for (let i = 0; i < successOrders.length; i += batchSize) {
        const currentBatch = successOrders.slice(i, i + batchSize);
        batches.push(currentBatch); // Push the current batch of orders
    }

    // Process each batch sequentially (one at a time)
    for (const batch of batches) {
        await processBatch(batch); // Wait for the current batch to finish before processing the next one
    }

    // Remove any duplicates between success and failed order numbers
    return {
        success: updateSuccess,
        failed: updateFailed?.filter(num => !updateSuccess.includes(num)),
        isSameOrderNumbers: updateSuccess?.some(successOrder => orderNumbers?.includes(successOrder))
    };
};



// Main function to execute the state change logic
export const execute = async (orderNumbers) => {
    const startTime = Date.now(); // Capture start time for the entire `changeOrderState` process
    console.log("Starting changeOrderState.....");
    console.log("RESUBMIT ORDERS", await changeOrderState(orderNumbers)); // Call changeOrderState and log the result
    const endTime = Date.now(); // Capture end time after the function has finished
    console.log("Total Execution Time for changeOrderState:", `${endTime - startTime}ms`)
    console.log(`Finished.`); // Log total execution time
};
