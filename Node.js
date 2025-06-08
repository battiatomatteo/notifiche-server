const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors()); 
app.use(express.json());

app.post('/notifica', async (req, res) => {
  console.log("Richiesta ricevuta:", req.body);
  const { oneSignalId, titolo, messaggio } = req.body;
  if (!oneSignalId) {
    console.error("oneSignalId mancante!");
    return res.status(400).send("Missing oneSignalId");
  }

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic LA_TUA_REST_API_KEY'
      },
      body: JSON.stringify({
        app_id: 'LA_TUA_ONESIGNAL_APP_ID',
        include_player_ids: [oneSignalId],
        headings: { en: titolo },
        contents: { en: messaggio }
      })
    });

    const responseText = await response.text();
    console.log("Risposta OneSignal:", response.status, responseText);

    if (!response.ok) {
      return res.status(500).send("Errore OneSignal: " + responseText);
    }

    res.status(200).send("Notifica inviata");
  } catch (error) {
    console.error("Errore durante la chiamata a OneSignal:", error);
    res.status(500).send("Errore interno");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server avviato su porta ${PORT}`));
