import './globals.css';
import { fraunces, dmSans } from './fonts';
import ReduxProvider from '../providers/ReduxProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${dmSans.variable}`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}