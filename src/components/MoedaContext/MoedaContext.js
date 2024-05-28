import React, { createContext, useState, useEffect } from "react";

 const MoedaContext = createContext();

 const MoedaProvider = ({ children }) => {
  const [moedas, setMoedas] = useState([]);

  useEffect(() => {
    const fetchMoedas = async () => {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        if(!response.ok) {
            throw new Error("Não foi possível obter as moedas");
            }
            const data = await response.json();
            const moedas = Object.keys(data.rates);
            setMoedas(moedas);
      } catch (error) {
        console.error('Erro buscando moedas:', error.message);
      }
    };

    fetchMoedas();
  }, []);

  return (
    <MoedaContext.Provider value={moedas}>
      {children}
    </MoedaContext.Provider>
  );
};

export { MoedaProvider, MoedaContext };
