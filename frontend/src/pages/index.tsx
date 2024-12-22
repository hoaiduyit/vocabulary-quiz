import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { TopNavLayout } from '@/layouts/TopNavLayout';
import { useSignInDialogCommit } from '@/contexts/signin.context';
import { useUserProfileSelector } from '@/contexts/userProfile.context';
import { useRouter } from 'next/router';
import { createRoom } from '@/services/room.service';

function Home() {
  const { push } = useRouter();
  const signInDialogCommit = useSignInDialogCommit();
  const profile = useUserProfileSelector((store) => store.profile);

  const [loading, setLoading] = useState(false);

  const handleOpenSigninDialog = () => {
    signInDialogCommit({
      openSignInDialog: true,
    });
  };

  const handleOpenJoinRoomDialog = () => {
    signInDialogCommit({ openJoinRoomDialog: true });
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const data = await createRoom();
      push(`/rooms/${data.code}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl">Welcome to Vocabulary Quiz</h1>
      <div className="flex flex-col items-center justify-center gap-2">
        {profile ? (
          <>
            <LoadingButton
              loading={loading}
              variant="contained"
              className="text-lg"
              onClick={handleCreateRoom}
            >
              Create Room
            </LoadingButton>
            or
            <Button variant="outlined" className="text-lg" onClick={handleOpenJoinRoomDialog}>
              Join a room
            </Button>
          </>
        ) : (
          <>
            <Button variant="contained" className="text-lg" onClick={handleOpenSigninDialog}>
              Login to join
            </Button>
            or
            <Button variant="outlined" className="text-lg">
              Join a room as guest
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

Home.layout = TopNavLayout;

export default Home;
