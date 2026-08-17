import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'SyncSlate',
  description: 'Real-time collaborative whiteboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}