import { Modal } from '@/components/Modal/Modal';
import { quizs } from '@/constants';
import { useSignInDialogCommit } from '@/contexts/signin.context';
import { useUserProfileSelector } from '@/contexts/userProfile.context';
import { TopNavLayout } from '@/layouts/TopNavLayout';
import { getRoomByCode, getRoomScoreboards, updateUserScore } from '@/services/room.service';
import { SocketService } from '@/services/socket.service';
import { PaginationType } from '@/types/pagination.type';
import { RoomType } from '@/types/room.type';
import { ScoreboardType } from '@/types/scoreboard.type';
import { Button, Chip } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  if (!query?.code) return { notFound: true };
  try {
    const data = await getRoomByCode(query.code as string);
    if (!data) return { notFound: true };
    const scoreboards = await getRoomScoreboards(query.code as string);
    return {
      props: {
        room: data,
        scoreboards,
      },
    };
  } catch (error) {
    return {
      props: {
        room: null,
      },
    };
  }
}

const socketService = SocketService.getInstance();

function RoomPage({
  room,
  scoreboards,
}: {
  room: RoomType | null;
  scoreboards: {
    scoreboards: ScoreboardType[];
  } & PaginationType;
}) {
  const { query } = useRouter();
  const profile = useUserProfileSelector((store) => store.profile);
  const fetching = useUserProfileSelector((store) => store.fetching);
  const signInDialogCommit = useSignInDialogCommit();
  const [roomData, setRoomData] = useState<RoomType | null>(room);
  const [leaderboard, setLeaderboard] = useState(scoreboards.scoreboards);
  const [quizNo, setQuizNo] = useState(0);
  const [selectedAnwsers, setSelectedAnwsers] = useState<{ [key: number]: number }>(
    {} as { [key: number]: number },
  );

  const handleOpenSigninDialog = () => {
    signInDialogCommit({
      openSignInDialog: true,
    });
  };

  const handleOpenJoinRoomDialog = () => {
    signInDialogCommit({ openJoinRoomDialog: true });
  };

  const handleClickNextPrev = (type: 'next' | 'prev') => () => {
    setQuizNo((pre) => (type === 'next' ? pre + 1 : pre - 1));
  };

  const handleSelectAnwser = (index: number) => () => {
    setSelectedAnwsers((pre) => ({
      ...pre,
      [quizNo]: index,
    }));
  };

  const handleSubmitQuiz = async () => {
    try {
      const correctedAnwsers = quizs
        .map((item, index) => item.answers[selectedAnwsers[index]])
        .filter((item) => item && item.isCorrect);
      const totalScores = correctedAnwsers.length * 100;
      await updateUserScore(query.code as string, totalScores);
      setSelectedAnwsers({});
      setQuizNo(0);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const code = query.code as string;
    socketService.joinEmit(code);
    socketService.updateScoreEmit(code);
    socketService.joinRoom((data) => {
      setRoomData(data.room);
    });
    socketService.updatedUserScores((data) => {
      setLeaderboard(data.scoreboards.scoreboards);
    });
    socketService.leaveRoom((data) => {
      setRoomData(data.room);
    });
    return () => {
      socketService.leaveEmit(code);
      socketService.cleanUp();
    };
  }, [query.code]);

  return (
    <div className="p-6 flex flex-col gap-4">
      <h2 className="text-xl">Participants: {roomData?.participants?.length || 0}</h2>
      <div className="flex gap-2">
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
        <div className="w-5/6 flex flex-col gap-6">
          <p className="text-lg">{quizs[quizNo].question}</p>
          <div className="flex gap-4 items-center">
            {quizs[quizNo].answers.map((a, index) => (
              <div
                key={a.text}
                role="button"
                tabIndex={0}
                onClick={handleSelectAnwser(index)}
                className="cursor-pointer"
              >
                <Chip
                  size="medium"
                  label={a.text}
                  color="primary"
                  variant={selectedAnwsers[quizNo] === index ? 'filled' : 'outlined'}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <Button
              disabled={quizNo === 0}
              variant="contained"
              onClick={handleClickNextPrev('prev')}
            >
              Prev
            </Button>
            <Button
              disabled={quizNo === quizs.length - 1}
              variant="contained"
              onClick={handleClickNextPrev('next')}
            >
              Next
            </Button>
            {quizNo === quizs.length - 1 && (
              <Button variant="contained" onClick={handleSubmitQuiz}>
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
      <Modal
        open={!profile && !fetching}
        onClose={() => {}}
        size="md"
        title="Choose option to join room"
        showAction={false}
        preventEscapeCloser
        preventBackdropClickClose
      >
        <div className="flex items-center justify-center gap-4">
          <Button variant="contained" className="text-lg" onClick={handleOpenSigninDialog}>
            Login to join
          </Button>
          or
          <Button variant="outlined" className="text-lg" onClick={handleOpenJoinRoomDialog}>
            Join as a guest
          </Button>
        </div>
      </Modal>
    </div>
  );
}

RoomPage.layout = TopNavLayout;

export default RoomPage;
