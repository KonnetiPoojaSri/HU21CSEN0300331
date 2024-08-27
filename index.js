const express = require('express');
const axios = require('axios');

const app = express();
const port = 9872;
const windowSize = 10;
let numbers = [];

app.use(express.json());

const fetchNumbers = async (type) => {
    try {
     
      const mockResponses = {
        'primes': [2, 3, 5, 7],
        'fibo': [1, 1, 2, 3, 5, 8],
        'even': [2, 4, 6, 8],
        'rand': [4, 7, 9, 1]
      };
      console.log(`Fetched ${type} numbers:`, mockResponses[type] || []);
      return mockResponses[type] || [];
    } catch (error) {
      console.error(`Error fetching ${type} numbers`, error);
      return [];
    }
  };
  

const calculateAverage = (numArray) => {
  if (numArray.length === 0) return 0;
  const sum = numArray.reduce((a, b) => a + b, 0);
  return parseFloat((sum / numArray.length).toFixed(2));
};

app.post('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  const windowPrevState = [...numbers];
  let fetchedNumbers = [];

 
  const startTime = Date.now();
  switch (numberid) {
    case 'p': fetchedNumbers = await fetchNumbers('primes'); break;
    case 'f': fetchedNumbers = await fetchNumbers('fibo'); break;
    case 'e': fetchedNumbers = await fetchNumbers('even'); break;
    case 'r': fetchedNumbers = await fetchNumbers('rand'); break;
    default: return res.status(400).json({ error: 'Invalid ID' });
  }
  const elapsedTime = Date.now() - startTime;

 
  if (elapsedTime > 500) {
    return res.status(504).json({ error: 'Request timeout' });
  }

  numbers = [...new Set([...numbers, ...fetchedNumbers])]; 
  if (numbers.length > windowSize) {
    numbers = numbers.slice(-windowSize); 
  }


  const average = calculateAverage(numbers);

  
  res.json({
    windowPrevState,
    windowCurrState: numbers,
    numbers: fetchedNumbers,
    avg: average,
  });
});

app.listen(port, () => {
  console.log(`Average Calculator service running at http://localhost:${port}`);
});

