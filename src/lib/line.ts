import { CONTACT } from '../config/site';

export const lineMessageUrl = (message: string) =>
  `https://line.me/R/oaMessage/${CONTACT.lineId}/?${encodeURIComponent(message)}`;
