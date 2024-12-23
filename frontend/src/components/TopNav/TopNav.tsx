import Link from 'next/link';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import { leaveRoom } from '@/services/room.service';

export const TopNav = () => {
  const { query, push } = useRouter();

  const handleLeaveRoom = async () => {
    await leaveRoom(query.code as string);
    push('/');
  };

  return (
    <div className="flex justify-between py-6 px-4 bg-sky-500 fixed top-0 w-full">
      <Link className="text-white text-lg" href="/">
        Vocabulary Quiz
      </Link>
      <div className="flex gap-2">
        {query.code && (
          <Button variant="contained" color="error" onClick={handleLeaveRoom}>
            Leave room
          </Button>
        )}
      </div>
    </div>
  );
};
