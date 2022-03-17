import {render, screen, waitFor, within} from '@testing-library/react';
import Game from './Game';

beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve([{text: "A verse from the bible", bookname: "Book", chapter: "1", verse: "2"}])
    })
  );
})

test('renders the words', async () => {
  await render(<Game />);
  await waitFor(() => {
      expect(screen.getByText(/A/)).toBeInTheDocument();
      expect(screen.getByText(/bible/)).toBeInTheDocument();
      expect(screen.getByText(/from/)).toBeInTheDocument();
      expect(screen.getByText(/the/)).toBeInTheDocument();
      expect(screen.getByText(/verse/)).toBeInTheDocument();
  });
});
