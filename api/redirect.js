export default async function handler(req, res) {
    const sheetId = "1gkvJcqNvJ3wIo2eLTN4CpPtzTdtwMNHLmFLiK6r6fmI";
    const sheetName = "Vidéos";
    const startDate = new Date('2024-01-06');
  
    try {
      const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A2:B?key=${process.env.GOOGLE_API_KEY}`;
      const response = await fetch(sheetUrl);
      const json = await response.json();
  
      // Calcul manuel de la date à l'heure de Paris (YYYY-MM-DD uniquement)
      const parisDateStr = new Intl.DateTimeFormat('fr-CA', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date());
  
      const today = new Date(parisDateStr + 'T00:00:00'); // à minuit heure locale
  
      const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
      const urls = json.values.map(row => row[1]);
      const index = daysElapsed % urls.length;
  
      const redirectUrl = urls[index];
      res.writeHead(302, { Location: redirectUrl });
      res.end();
    } catch (e) {
      res.status(500).send("Erreur : " + e.message);
    }
  }
  