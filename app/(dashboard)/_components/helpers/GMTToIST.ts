export default function convertGMTtoIST(epochTimeGMT) {
    // Convert epoch time to milliseconds (required by Date constructor)
    const epochTimeMillis = epochTimeGMT * 1000;
  
    // Create a Date object using the epoch time in milliseconds
    const dateInGMT = new Date(epochTimeMillis);
  
    // Get the date, month, and year in IST
    const options : Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'short', day: 'numeric' };
    const dateInIST = dateInGMT.toLocaleString('en-IN', options);
  
    return dateInIST;
  }