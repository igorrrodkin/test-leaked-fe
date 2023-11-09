export default (number: number, word: string) => `${number} ${number === 1 ? word : `${word}s`}`;
