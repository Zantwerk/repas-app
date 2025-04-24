const nodemailer = require("nodemailer");
const users = require("./users.json");

const today = new Date().getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi
const jours = { 1: "mardi", 2: "jeudi", 5: "lundi" };
const jourCommande = jours[today];

if (!jourCommande) {
  console.log("⏱️ Pas de rappel aujourd'hui (ni lundi, mardi, ni vendredi).");
  process.exit(0);
}

console.log(`📅 Envoi des mails de rappel pour le jour : ${jourCommande}`);



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "panorama.theo@gmail.com", // remplace avec ton adresse Gmail
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
