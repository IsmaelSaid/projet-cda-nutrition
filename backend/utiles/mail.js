const calculateMB = require("./fonctions");
const nodemailer = require("nodemailer");

const sendEmail = (email, nom, prenom, plan) => {
  console.log("test mail", email);
  const identite = `${nom} ${prenom}`;
  const petitDejeunerIngredientsString = plan.petit_dejeuner.ingredient.reduce(
    (accumulator, currentValue) => {
      return (
        accumulator +
        `<li>${currentValue.nom} : ${currentValue.quantite} g</li>`
      );
    },
    ""
  );
  const DejeunerIngredientsString = plan.dejeuner.ingredient.reduce(
    (accumulator, currentValue) => {
      return (
        accumulator +
        `<li>${currentValue.nom} : ${currentValue.quantite} g</li>`
      );
    },
    ""
  );
  const DinerIngredientsString = plan.petit_dejeuner.ingredient.reduce(
    (accumulator, currentValue) => {
      return (
        accumulator +
        `<li>${currentValue.nom} : ${currentValue.quantite} g</li>`
      );
    },
    ""
  );
  const message = `
  <h1>Plan nutritition</h1>
<p>J'espère que vous allez bien ${identite}, Suite à la soumission de votre formulaire nous vous transmettons votre programme sur la base de 3 repas quotidien.</p>

<h2>Petit-déjeuner:</h2>

<p><strong>${plan.petit_dejeuner.plat.nom}</strong></p>
<p>Description : ${plan.petit_dejeuner.plat.description}</p></br>
<p><strong>Ingrédients : </strong></p>
<ul style="list-style: none;">
${petitDejeunerIngredientsString}
</ul>
<p>Calories du plat : ${plan.petit_dejeuner.plat.calories} kcal</p>


<h2>Déjeuner:</h2>
<p><strong>${plan.dejeuner.plat.nom}</strong></p>
<p>Description : ${plan.dejeuner.plat.description}</p></br>
<p><strong>Ingrédients : </strong></p>
<ul style="list-style: none;">
${DejeunerIngredientsString}
</ul>
<p>Calories du plat : ${plan.dejeuner.plat.calories} kcal</p>
<h2>Dîner:</h2>
<p><strong>${plan.diner.plat.nom}</strong></p>
<p>Description : ${plan.diner.plat.description}</p></br>
<p><strong>Ingrédients : </strong></p>
<ul style="list-style: none;">
${DinerIngredientsString}
</ul>
<p>Calories du plat : ${plan.diner.plat.calories} kcal</p>


<p>Le total calorique de votre plan est de ${plan.totalCalories} kcal </p>
<p>Le total de proteines de votre plan est de ${plan.totalProteines.toFixed(
    2
  )} g </p>
<p>Le total de lipides de votre plan est de ${plan.totalGlucides.toFixed(
    2
  )} g </p>
<p>Le total de glucides de votre plan est de ${plan.totalLipides.toFixed(
    2
  )} g </p>

<p>Je vous encourage à suivre ce programme avec discipline tout en écoutant votre corps. N'hésitez pas à me contacter si vous avez des questions ou des préoccupations.

Restant à votre disposition pour toute assistance supplémentaire.
Cordialement,<p>
<img src="cid:114" alt='logo'>
`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "yohan.mail97417@gmail.com",
      pass: "rnjp imiq qmew yyij",
    },
  });

  const attachment = {
    filename: "logo.png",
    path: "public/images/logo.png",
    cid: "114", // Identifiant unique de l'image
  };
  const mailOptions = {
    from: {
      name: "Nutrition cda",
      address: "yohan.mail97417@gmail.com",
    },
    to: email,
    subject: "Send nutrition plat",
    text: `J'espère que vous allez bien. ${identite}, Suite à la soumission de votre formulaire nous vous transmettons votre programme sur la base de 3 repas quotidien.`,
    html: message,
    attachments: [attachment],
  };

  const sendMail = async (transporter, mailOptions) => {
    try {
      await transporter.sendMail(mailOptions);
      console.log("mail send");
    } catch (error) {
      console.error(error);
    }
  };
  sendMail(transporter, mailOptions);
};
module.exports = {
  sendEmail,
};
