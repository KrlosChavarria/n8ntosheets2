import "./globals.css";

export const metadata = {
  title: "Sheets → n8n",
  description: "Selecciona un Spreadsheet y envíalo a n8n",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}