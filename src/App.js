import Calculadora from "./components/Calculadora/Calculadora";
import { MoedaProvider } from "./components/MoedaContext/MoedaContext";


function App() {
  return (
    <MoedaProvider>
      <Calculadora/>
    </MoedaProvider>
  );
}

export default App;
