// client/src/ui/game/GameResults.tsx
import CountUp from 'react-countup';
import { useScale } from '../Scale';

import HomeImg from '../../assets/img/home.png';
import PlayAgainImg from '../../assets/img/play-again.png';

import './GameResults.scss';
import { DisconnectTypes } from '../../game/Types';
import { calculateGemsXP } from '@/utils/helpers';

function GameResults({ onHome, results, game, isLoggedIn, adElement }: any) {
  /* ===== helper ===== */
  const emitClear = () => game.events.emit('setGameResults', null);

  const handleHome = () => {
    onHome();
    emitClear();
    game.events.emit('startSpectate');
  };

  const handleRestart = () => {
    emitClear();
    game.events.emit('restartGame');
  };

  /* ===== disconnect ===== */
  const { code = DisconnectTypes.Server, reason = '' } =
    results.disconnectReason ?? {};

  const isRaceFinished = /race\s*finished/i.test(reason);

  const titleMap: Record<number, string> = {
    [DisconnectTypes.Player]: 'You got stabbed',
    [DisconnectTypes.Mob]: 'You were destroyed',
    [DisconnectTypes.Server]: isRaceFinished
      ? 'Race finished # new round soon'
      : 'You were disconnected',
  };

  const labelMap: Record<number, string> = {
    [DisconnectTypes.Player]: 'Stabbed by',
    [DisconnectTypes.Mob]: 'By',
    [DisconnectTypes.Server]: isRaceFinished ? '' : 'Disconnect reason:',
  };

  /* ===== login data ===== */
  const { gems, xp, ultimacy } = calculateGemsXP(results.coins, results.kills);

  /* ===== render ===== */
  return (
    <div className="results" style={useScale(true).styles}>
      <div className="results-main">
        {/* --- title --- */}
        <div className="results-title">
          {titleMap[code]}
          <br />
        </div>

        {/* --- data --- */}
        <div className="results-container">
          {labelMap[code] && <InfoRow title={labelMap[code]} value={reason} />}

          <InfoRow
            title="Coins:"
            value={<CountUp end={results.coins} duration={3} />}
          />
          <InfoRow
            title="Stabs:"
            value={<CountUp end={results.kills} duration={3} />}
          />
          <InfoRow
            title="Survived:"
            value={
              <CountUp
                end={results.survivalTime}
                duration={3}
                formattingFn={(s) =>
                  `${((s % 3600) / 60).toFixed(0)}m ${(s % 60).toFixed(0)}s`
                }
              />
            }
          />

          {isLoggedIn && (
            <>
              <InfoRow
                title="Gems Gained"
                value={<CountUp end={gems} duration={3} />}
              />
              <InfoRow
                title="XP Gained"
                value={<CountUp end={xp} duration={3} />}
              />
              <InfoRow
                title="Mastery Earned"
                value={<CountUp end={ultimacy} duration={3} />}
              />
            </>
          )}
        </div>

        {/* --- button --- */}
        <div className="results-buttons">
          <IconButton
            className="to-home"
            img={HomeImg}
            alt="Home"
            onClick={handleHome}
          />
          {code !== DisconnectTypes.Server && !isRaceFinished && (
            <IconButton
              className="play-again"
              img={PlayAgainImg}
              alt="Play again"
              onClick={handleRestart}
            />
          )}
        </div>
      </div>

      {adElement && <div className="ad">{adElement}</div>}
    </div>
  );
}

/* ====== mini tool ====== */
function InfoRow({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="info">
      <div className="title">{title}</div>
      {value}
    </div>
  );
}

function IconButton({
  className,
  img,
  alt,
  onClick,
}: {
  className: string;
  img: string;
  alt: string;
  onClick: () => void;
}) {
  return (
    <div
      className={className}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <img src={img} alt={alt} />
    </div>
  );
}

export default GameResults;
