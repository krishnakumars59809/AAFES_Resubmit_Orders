import { data } from "./Data.js";

function splitArrayIntoChunks(inputArray, chunkSize = 100) {
    if (!Array.isArray(inputArray)) {
        console.log("Input must be an array");
        return;
    }

    const result = [];
    const seen = new Set(); // A Set to track unique order numbers
    const duplicates = new Set(); // A Set to track duplicates

    // Filter out duplicates before splitting into chunks
    const uniqueArray = inputArray.filter(orderNumber => {
        if (seen.has(orderNumber)) {
            duplicates.add(orderNumber); // Add to duplicates if already seen
            return false; // Skip duplicates
        }
        seen.add(orderNumber);
        return true;
    });

    // Log the duplicates
    console.log("Duplicate items length:", duplicates.size);
    console.log("Duplicate items:", [...duplicates]);

    // Split the unique array into chunks
    for (let i = 0; i < uniqueArray.length; i += chunkSize) {
        result.push(uniqueArray.slice(i, i + chunkSize)); // Create chunks of `chunkSize`
    }

    return result;
}

const result = data.match(/,\s*(67\d{8,})\b/g)?.map(match => parseInt(match.trim().slice(1))) || [];
// Split extracted IDs into chunks of 100
const chunks = splitArrayIntoChunks(result, 100);

console.log("Number Of data:", result?.length);
console.log("Number Of Resubmit Order Ids:", chunks?.flatMap((chunk) => chunk)?.length)
console.log("Chunks:", chunks); // Array of chunks, each with up to 100 items // Output: [ [6720675085], [6720675050],[ 6720675040] ]
console.log("Number of Chunks:", chunks.length); // Total number of chunks
