export default async function handler(req, res) {
    const sheetId = "1gkvJcqNvJ3wIo2eLTN4CpPtzTdtwMNHLmFLiK6r6fmI";
    const sheetName = "Vidéos";
    const startDate = new Date('2024-01-06');
  
    try {
      const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A2:B?key=${process.env.GOOGLE_API_KEY}`;
      const response = await fetch(sheetUrl);
      const json = await response.json();
  
      const nowParis = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
      const today = new Date(nowParis);
  
      const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  
      console.log("👉 Date Paris :", today);
      console.log("👉 Jours écoulés :", daysElapsed);
      console.log("👉 Données JSON reçues :", JSON.stringify(json));
  
      const urls = json.values?.map(row => row[1]);
      const index = daysElapsed % urls.length;
      const redirectUrl = urls[index];
  
      console.log("👉 Index vidéo :", index);
      console.log("👉 URL sélectionnée :", redirectUrl);
  
      if (!redirectUrl) {
        throw new Error("Aucune URL trouvée pour l'index " + index);
      }
  
      res.writeHead(302, { Location: redirectUrl });
      res.end();
    } catch (e) {
      res.status(500).send("Erreur : " + e.message);
    }
  }
  