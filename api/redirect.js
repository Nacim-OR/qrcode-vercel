export default async function handler(req, res) {
    const sheetId = "1gkvJcqNvJ3wIo2eLTN4CpPtzTdtwMNHLmFLiK6r6fmI";
    const sheetName = "CAF";
    const startDate = new Date('2024-01-06');
  
    try {
      const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A2:B?key=${process.env.GOOGLE_API_KEY}`;
      const response = await fetch(sheetUrl);
      const json = await response.json();
  
      // Heure actuelle à Paris
      const nowParisStr = new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" });
      const nowParis = new Date(nowParisStr);
  
      // Date de "bascule" aujourd'hui à 00h10 (heure de Paris)
      const pivot = new Date(nowParis);
      pivot.setHours(0, 0, 0, 0);
  
      // Si on est avant 00h10, on reste sur le jour précédent
      const effectiveDate = nowParis < pivot ? new Date(nowParis.setDate(nowParis.getDate() - 1)) : nowParis;
  
      const daysElapsed = Math.floor((effectiveDate - startDate) / (1000 * 60 * 60 * 24));
      const urls = json.values.map(row => row[1]);
      const index = daysElapsed % urls.length;
  
      const redirectUrl = urls[index];
      res.writeHead(302, { Location: redirectUrl });
      res.end();
    } catch (e) {
      res.status(500).send("Erreur : " + e.message);
    }
  }
  