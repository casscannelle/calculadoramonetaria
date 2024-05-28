import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MoedaProvider, MoedaContext } from './MoedaContext';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('MoedaProvider', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('fetch e busca moedas', async () => {
    // Mock da API
    fetch.mockResponseOnce(JSON.stringify({
      rates: {
        USD: 1,
        EUR: 0.84,
        GBP: 0.74
      }
    }));

    const TestComponent = () => {
      const moedas = React.useContext(MoedaContext);
      return (
        <div>
          {moedas.length > 0 ? moedas.join(', ') : 'Carregando...'}
        </div>
      );
    };

    render(
        <MoedaProvider>
            <TestComponent />
        </MoedaProvider>
    );

    expect(await screen.findByText('Carregando...')).toBeInTheDocument();

    expect(await screen.findByText('USD, EUR, GBP')).toBeInTheDocument();
  });
});
