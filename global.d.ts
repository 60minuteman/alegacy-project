import { ReactNode } from 'react';

declare global {
  namespace JSX {
    interface Element extends ReactNode {}
  }
}