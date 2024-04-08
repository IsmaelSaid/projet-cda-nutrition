const calculateMB = (masse, taille, sexe, age) => {
  if (sexe) {
    return 13.707 * masse + 492.3 * (taile / 100) - 6.673 * age + 77.607;
  } else {
    return 9.74 * masse + 172.9 * (taille / 100) - 4.737 * age + 667.051;
  }
};

const calculeBesoinMacronutrimentsQuotidient = (mb) => {
  return {
    proteines: mb * (20 / 100),
    glucides: mb * (30 / 100),
    lipides: mb * (50 / 100),
  };
};

module.exports = { calculateMB, calculeBesoinMacronutrimentsQuotidient };
