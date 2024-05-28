import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MoedaContext } from '../MoedaContext/MoedaContext';
import Calculadora from './Calculadora';

const mockMoedas = ['USD', 'BRL', 'EUR'];

const mockFetch = (rate) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ rates: { BRL: rate } }),
    })
  );
};

describe('Componente Calculadora, simulando taxa fixa de cambio', () => {
  beforeEach(() => {
    mockFetch(5.0); 
  });

  afterEach(() => {
    global.fetch.mockClear();
  });

  test('teste de render', () => {
    render(
      <MoedaContext.Provider value={mockMoedas}>
        <Calculadora />
      </MoedaContext.Provider>
    );

    expect(screen.getByText(/Converta valores/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Valor/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Converter/i })).toBeInTheDocument();
  });

  test('se alerta aparece em caso de valores iguais', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MoedaContext.Provider value={mockMoedas}>
        <Calculadora />
      </MoedaContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Valor/i), { target: { value: '10' } });
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'USD' } });
    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'USD' } });
    fireEvent.click(screen.getByRole('button', { name: /Converter/i }));

    expect(window.alert).toHaveBeenCalledWith('Valores inválidos.');

    window.alert.mockRestore();
  });

  test('se converte corretamente', async () => {
    render(
      <MoedaContext.Provider value={mockMoedas}>
        <Calculadora />
      </MoedaContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Valor/i), { target: { value: '10' } });
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'USD' } });
    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'BRL' } });
    fireEvent.click(screen.getByRole('button', { name: /Converter/i }));

    await waitFor(() => {
      expect(screen.getByDisplayValue('50.00')).toBeInTheDocument();
    });
  });

  test('alerta se campo de valor estiver vazio', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MoedaContext.Provider value={mockMoedas}>
        <Calculadora />
      </MoedaContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Converter/i }));

    expect(window.alert).toHaveBeenCalledWith('Digite um valor válido.');

    window.alert.mockRestore();
  });
});
