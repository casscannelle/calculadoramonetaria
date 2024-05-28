import React, { useContext, useState } from "react";
import { Paper, TextField, FormControl, Select, Button } from "@mui/material";
import { MoedaContext } from "../MoedaContext/MoedaContext";
import "./Calculadora.css";

const Calculadora = () => {
  const moedas = useContext(MoedaContext);

  const [text1, setText1] = useState('');
  const [text2, setText2] = useState(0);
  const [valor1, setValor1] = useState('');
  const [valor2, setValor2] = useState('');

  const convert = async (e) => {
    e.preventDefault();

    if (!text1.trim()) {
      alert("Digite um valor válido.");
      return;
    }

    if (valor1 && valor2 && !isNaN(parseFloat(text1))) {
      if (valor1 !== valor2) {
        try {
          const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${valor1}`);
          if (!response.ok) {
            throw new Error("Erro ao obter a taxa de conversão");
          }
          const data = await response.json();
          const rate = data.rates[valor2];
          const valorConvertido = rate * parseFloat(text1);
          setText2(valorConvertido.toFixed(2));
        } catch (error) {
          console.error("Erro ao obter a taxa de conversão. Tente novamente:", error);
          alert("Erro ao obter a taxa de conversão. Tente novamente.");
        }
      } else {
        alert("Valores inválidos.");
      }
    } else {
      alert("Valor inválido.");
    }
  };

  return (
    <div>
      <Paper elevation={3} className="calculadora">
        <h3>Converta valores</h3>
        <form onSubmit={convert}>
          <div>
            <FormControl variant="outlined" className="dropdown">
              <Select native value={valor1} onChange={(e) => setValor1(e.target.value)}>
                <option value="">Selecione uma moeda</option>
                {moedas.map((moeda, index) => (
                  <option key={index} value={moeda}>{moeda}</option>
                ))}
              </Select>
            </FormControl>
            <TextField
              variant="outlined"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Valor"
              autoComplete="off"
              name="input"
            />
            <FormControl variant="outlined" className="dropdown">
              <Select native value={valor2} onChange={(e) => setValor2(e.target.value)}>
                <option value="">Selecione uma moeda</option>
                {moedas.map((moeda, index) => (
                  <option key={index} value={moeda}>{moeda}</option>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <Button type="submit" className="button" variant="contained" color="primary">Converter</Button>
          </div>
          <div>
            <TextField
              variant="outlined"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              autoComplete="off"
            />
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default Calculadora;
