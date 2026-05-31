import { englishSession } from '../english-session';
import { mathsSession } from '../maths-session';
import type { Session } from '../types';

import { y4English } from './y4-english';
import { y4Maths } from './y4-maths';
import { y4Science } from './y4-science';
import { y4Hass } from './y4-hass';
import { y5English } from './y5-english';
import { y5Maths } from './y5-maths';
import { y5Science } from './y5-science';
import { y5Hass } from './y5-hass';
import { y6English } from './y6-english';
import { y6Maths } from './y6-maths';
import { y6Science } from './y6-science';
import { y6Hass } from './y6-hass';

export const allSessions: Session[] = [
  englishSession,
  mathsSession,
  ...y4English,
  ...y4Maths,
  ...y4Science,
  ...y4Hass,
  ...y5English,
  ...y5Maths,
  ...y5Science,
  ...y5Hass,
  ...y6English,
  ...y6Maths,
  ...y6Science,
  ...y6Hass,
];

export const sessionsByYear: Record<number, Session[]> = {
  4: [...y4English, ...y4Maths, ...y4Science, ...y4Hass],
  5: [...y5English, ...y5Maths, ...y5Science, ...y5Hass],
  6: [...y6English, ...y6Maths, ...y6Science, ...y6Hass],
};

export const sessionsBySubject = allSessions.reduce<Record<string, Session[]>>((acc, s) => {
  (acc[s.subject] ??= []).push(s);
  return acc;
}, {});

export function getSession(id: string): Session | undefined {
  return allSessions.find(s => s.id === id);
}
