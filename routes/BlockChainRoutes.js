const express = require('express');
const { connectWallet, displayWallet, tokenConversion, pushRequests, confirmed, rejected } = require('../controllers/BlockChainController');
const { walletNotConnected, walletConnected } = require('../middlewares/middleware');
const { default: axios } = require('axios');

require('dotenv').config();

const BlockChainRouter = express.Router();

BlockChainRouter.get('/wallet-display', walletConnected, displayWallet);

BlockChainRouter.post('/save-wallet', walletNotConnected, connectWallet);

BlockChainRouter.post('/claim', walletConnected, tokenConversion);

BlockChainRouter.post('/prepare-transaction', walletConnected, pushRequests);

BlockChainRouter.post('/confirm-transaction', walletConnected, confirmed);

BlockChainRouter.post('/reject-transaction', walletConnected, rejected);

async function validateWithGemini(promptText) {

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: promptText }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const output = response.data.candidates[0]?.content?.parts[0]?.text || '';

    const cleanedStr = output.replace(/```json\s*|\s*```|\n/g, '').trim();
    return JSON.parse(cleanedStr);  // Returning parsed JSON response from Gemini API
  } catch {
    throw new Error('Failed to validate with Gemini API');
  }
}

// Endpoint for task validation
BlockChainRouter.post('/validate-task', async (req, res) => {
  const { skillset, description } = req.body;

  // Prompt to pass to Gemini API for task validation
  const taskPrompt = `
    You are validating a developer task form.
  
    Given:
    Skillset: ${skillset}
    Description: ${description}
  
    1. Normalize the skillset to common programming terms. For example python becomes Python or c becomes C and so on.
    2. Classify task difficulty as Easy, Medium, or Hard based on description.
    3. Check if the description is meaningful and related to programming tasks (not gibberish like vjebkjerbgreb or irrelevant like meow meow or spam like 1234567890).
    4. Make sure this doesn't contain any abusive or threatening language in any language (include short forms like mkc, bc, etc. of such things in various langauges like Hindi to bypass such checks too).
    5. Make sure it is in English only. No Hinglish and so on.
  
    Return result without Formatting in JSON like:
    {
      "valid": true,
      "normalizedSkillset": [...],
      "difficulty": "Medium",
      "reason": "Description is relevant and skillset matched"
    }
    `;

  try {
    // Call Gemini API for task validation
    const result = await validateWithGemini(taskPrompt);

    if (result.valid) {
      res.status(200).json(result);  // Valid data, send the result back
    } else {
      res.status(400).json({ error: 'Invalid task data', reason: result.reason });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error during validation', details: error.message });
  }
});

// Endpoint for report validation
BlockChainRouter.post('/validate-report', async (req, res) => {
  const { reportType, description } = req.body;

  // Prompt to pass to Gemini API for report validation
  const reportPrompt = `
    You are validating a user report form.
  
    Given:
    Report Type: ${reportType}
    Description: ${description}
  
    1. Determine if the description logically matches the selected report type (e.g., spam, abuse, fake profile).
    2. Check if the description is clear and not gibberish.
  
    Return result in JSON format like:
    {
      "valid": true,
      "reason": "Description matches the report type and is meaningful"
    }
    `;

  try {
    // Call Gemini API for report validation
    const result = await validateWithGemini(reportPrompt);

    if (result.valid) {
      res.status(200).json(result);  // Valid data, send the result back
    } else {
      res.status(400).json({ error: 'Invalid report data', reason: result.reason });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error during validation', details: error.message });
  }
});


module.exports = BlockChainRouter;