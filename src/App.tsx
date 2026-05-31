import './index.css';
import { usePetStore } from './store/petStore';
import MBTISelector from './components/MBTISelector';
import GameView from './components/GameView';

export default function App() {
  const mbtiType = usePetStore(s => s.mbtiType);
  return mbtiType ? <GameView /> : <MBTISelector />;
}
