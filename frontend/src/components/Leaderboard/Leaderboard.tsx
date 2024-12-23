import { SocketService } from '@/services/socket.service';
import { ScoreboardType } from '@/types/scoreboard.type';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface LeaderBoardProps {
  scoreboards: ScoreboardType[];
  socketService: SocketService;
}

export const Leaderboard = ({ scoreboards, socketService }: LeaderBoardProps) => {
  const { query } = useRouter();
  const [leaderboard, setLeaderboard] = useState(scoreboards);

  useEffect(() => {
    const code = query.code as string;
    socketService.updateScoreEmit(code);
    socketService.updatedUserScores((data) => {
      setLeaderboard(data.scoreboards.scoreboards);
    });
    return () => {
      socketService.cleanUp();
    };
  }, [query.code]);

  return (
    <div className="w-1/6 flex flex-col gap-2">
      <h4 className="text-lg font-bold uppercase">leaderboard</h4>
      <ul className="list-decimal pl-4">
        {leaderboard.map((item) => (
          <li key={item.id}>
            <strong>{item.user.displayName}</strong>
            <br />
            Scores: {item.score}
          </li>
        ))}
      </ul>
    </div>
  );
};
