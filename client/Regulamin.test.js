/* eslint-disable no-undef */
import { render } from '@testing-library/react';
import Regulamin from './src/pages/Regulamin';

describe('Komponent', () => {
  it('Renderowanie bez błedu', () => {
    const { getByText } = render(<Regulamin />);
    expect(getByText('Regulamin Rezerwacji Sali Weselnej'))
  });
});