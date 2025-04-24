const nodemailer = require("nodemailer");
const users = require("./users.json");

const jourCommande = "mardi"; // ← fixe pour test, fonctionne tous les jours
console.log("🔁 Test forcé - envoi simulé pour mardi");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ton.email@gmail.com", // remplace avec ton adresse Gmail
    pass: process.env.SMTP_PASS   // sera injecté via GitHub Actions
  }
});

(async () => {
  for (let user of users) {
    const mail = {
      from: '"Panorama Repas" <ton.email@gmail.com>',
      to: user.email,
      subject: `🍽️ Rappel - Commande de repas pour ${jourCommande}`,
      text: `Bonjour ${user.prenom},\n\nTu peux maintenant commander ton repas pour ${jourCommande} ici :\n👉 https://panorama--repas.firebaseapp.com/commande.html\n\nÀ bientôt,\nL’équipe Panorama.`,
    };

    try {
      await transporter.sendMail(mail);
      console.log(`✅ Email envoyé à ${user.email}`);
    } catch (err) {
      console.error(`❌ Erreur à ${user.email}: ${err.message}`);
    }
  }
})();
