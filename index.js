const express = require('express');
const cors = require('cors');
const axios = require('axios'); 
const app = express();
const port = 4000;

app.use(cors());

app.get('/', (req, res) => {
  console.log('Received a request');
  res.json({ message: 'Hi ' });
})
app.get('/sendpostrequest', async (req, res) => {
  try {
    const url = 'https://riktam.tigersheet.com/api/sheet-api/get-records';
    const headers = {
      'Authorization': 'C9B53439FA03FB946C93E9AC9963070B221EC0E3CD66399A',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    };  
    const sheetId = '78425244';

    const allRecords = await getAllRecords(url, headers, sheetId);
    
    // Get page and limit from request query parameters
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 7;

    // Calculate offset based on page and limit
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Slice the array to get the records for the current page
    const paginatedRecords = allRecords.slice(startIndex, endIndex);

    console.log('Records for Page', page, ':', paginatedRecords);
    
    res.send({ data: paginatedRecords });

    
    // const response = await axios.post(url, payload, { headers });
    // console.log('Response from Tigersheet', response.data);
    // res.send(response.data);
  } catch (error) {
    console.error('Error in post request:', error.message);
    res.status(500).send('Internal Server Error');
  }
});
async function getAllRecords(url, headers, sheetId) {
  const payload = {
    'sheet_id': sheetId,
  };

  const response = await axios.post(url, payload, { headers });
  console.log('All Records from Tigersheet Backend', response.data);

  return response.data.data;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
