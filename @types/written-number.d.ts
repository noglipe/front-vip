declare module 'written-number' {
    function writtenNumber(value: number, options?: {
      lang?: 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'nl' | 'ru' | 'pl' | 'cz';
      currency?: boolean;
      precision?: number;
      separator?: string;
      unit?: string;
      zero?: string;
      feminine?: boolean;
    }): string;
  
    export = writtenNumber;
  }