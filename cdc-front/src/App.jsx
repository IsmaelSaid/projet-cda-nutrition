import "./App.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { motion, useAnimation } from "framer-motion";
import { BottomNavigation } from "@mui/material";

import {
  calculeBesoinMacronutrimentsQuotidient,
  calculateMB,
} from "../../backend/utiles/fonctions";
import {
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import {
  Form,
  redirect,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFFFFF",
    },
  },
});
import { useEffect, useState } from "react";
import { ThemeProvider } from "@emotion/react";

import logo from "./assets/logo.png";
function Appbar() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar id="appbar" position="absolute" color="primary">
          <Toolbar style={{ margin: "auto" }}>
            <img src={logo} alt="img" height={40}></img>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}

function Root() {
  let navigate = useNavigate();

  return (
    <div id="main">
      <Appbar />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        id="messagecontainer"
      >
        <div id="message">
          <p id="landingpagetext">
            Obtenez des conseils nutritionnels gratuitements en 2 minutes.
          </p>
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              navigate("/form");
            }}
          >
            Essayer
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export function MyForm() {
  let navigate = useNavigate();
  const controls = useAnimation();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    age: "",
    taille: "",
    sexe: "male",
    poids: "",
  });

  const [errors, setErrors] = useState({
    username: false,
    nickname: false,
    email: false,
    age: false,
    taille: false,
    poids: false,
    sexe: false,
  });

  const questions = [
    { label: "Quelle est votre nom ?", name: "nom", type: "text" },
    { label: "Quelle est votre prénom ?", name: "prenom", type: "text" },
    { label: "Quelle est votre email ?", name: "email", type: "email" },
    { label: "Quelle est votre âge ?", name: "age", type: "number" },
    { label: "Quelle est votre poids ?", name: "poids", type: "number" },
    { label: "Quelle est votre taille ?", name: "taille", type: "number" },
    { label: "Quelle est votre sexe ?", name: "sexe", type: "radio" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e) => {
    setFormData({ ...formData, sexe: e.target.value });
  };

  const handleCancel = () => {
    if (counter > 0) {
      setCounter(counter - 1);
    }
  };

  const handleNext = () => {
    const currentQuestion = questions[counter];
    if (
      currentQuestion.type === "radio" ||
      formData[currentQuestion.name] !== ""
    ) {
      setErrors({ ...errors, [currentQuestion.name]: false });
      if (counter < questions.length - 1) {
        setCounter(counter + 1);
      }
    } else {
      setErrors({ ...errors, [currentQuestion.name]: true });
    }
  };

  const validateForm = (e) => {
    e.preventDefault();
    console.log(formData);
    const mb = calculateMB(
      parseInt(parseInt(formData.poids)),
      parseInt(formData.taille),
      formData.sexe === "male",
      parseInt(formData.age)
    );

    const besoinMacronutrimentsQuotidient =
      calculeBesoinMacronutrimentsQuotidient(mb);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const result = { mb: mb, ...besoinMacronutrimentsQuotidient };

    const raw = JSON.stringify(result);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch("http://192.168.0.74:3000/plan", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
    navigate("/results", { state: { data: formData, result: result } });

    console.log(formData);
  };

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    controls.start({ opacity: 1, x: 0 });
  }, [counter]);

  return (
    <Form onSubmit={validateForm}>
      <motion.div
        id="questioncontainer"
        initial={{ opacity: 0, x: 100 }}
        animate={controls}
        transition={{ duration: 0.5 }}
        key={counter}
      >
        <div id="questions">
          {questions[counter].type === "radio" ? (
            <div>
              <p>{questions[counter].label}</p>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                value={formData.sexe}
                name="sexe"
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
              </RadioGroup>
            </div>
          ) : (
            <div>
              <p>{questions[counter].label}</p>
              <TextField
                name={questions[counter].name}
                value={formData[questions[counter].name]}
                type={questions[counter].type}
                label={questions[counter].label}
                variant="standard"
                required
                onChange={handleChange}
                error={errors[questions[counter].name]}
                helperText={
                  errors[questions[counter].name] ? "Ce champ est requis" : ""
                }
              />
            </div>
          )}
        </div>
        <div id="buttonscontains">
          <span style={{ margin: "10px", color: "" }}>{`${counter + 1} / ${
            questions.length
          }`}</span>
          <Button
            color="error"
            id="formbutton"
            variant="contained"
            onClick={handleCancel}
          >
            Annuler
          </Button>

          {counter == questions.length - 1 ? (
            <Button id="formbutton" type="submit" variant="contained">
              Envoyer
            </Button>
          ) : (
            <Button
              color="success"
              id="formbutton"
              variant="contained"
              onClick={handleNext}
            >
              Suivant
            </Button>
          )}
        </div>
      </motion.div>
    </Form>
  );
}

export const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { result, data } = location.state;
  const labels = Object.keys(result);
  const values = Object.values(result);
  labels.shift();
  values.shift();

  const dataset = {
    labels: labels,
    datasets: [
      {
        label: "quantité en g",
        data: values,
        backgroundColor: ["#386B43", "#35964A", "#24C046"],
        borderColor: [
          "rgba(255, 255, 255, 1)",
          "rgba(255, 255, 255, 1)",
          "rgba(255, 255, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div id="results">
      <motion.div
        id="datacontainer"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 style={{ color: "#386B43" }} color="#386B43">
          Synthèse
        </h2>
        <p>
          {data.nom} {data.prenom}
        </p>
        <p>Age: {data.age} ans</p>
        <p>Mail: {data.email}</p>
        <p>Masse: {data.poids}kg</p>
        <p>Estimation du total calorique: {result.mb.toFixed(2)} kcal</p>
        <p>Sexe: {data.sexe == "male" ? "Homme" : "Femme"}</p>
        <p>Vos besoins en macronutriments :</p>
        <div style={{ height: 500 }}>
          <Pie data={dataset} />;
        </div>
        <div id="buttonscontains">
          <Button
            color="success"
            id="formbutton"
            variant="contained"
            onClick={() => {
              navigate("/");
            }}
          >
            Saisir
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Root;
