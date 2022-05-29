import { render, screen } from "@testing-library/react";
import App from "./App";

test('renders "Generate your own QR code to add WiFi!" header', () => {
  render(<App />);
  const linkElement = screen.getByText(
    /Generate your own QR code to add WiFi!/i,
  );
  expect(linkElement).toBeInTheDocument();
});
