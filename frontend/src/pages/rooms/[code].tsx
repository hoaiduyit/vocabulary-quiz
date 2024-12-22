import { TopNavLayout } from '@/layouts/TopNavLayout';
import { getRoomByCode } from '@/services/room.service';
import { SocketService } from '@/services/socket.service';
import { RoomType } from '@/types/room.type';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  if (!query?.code) return { notFound: true };
  try {
    const data = await getRoomByCode(query.code as string);

    return {
      props: {
        room: data,
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

function RoomPage({ room }: { room: RoomType | null }) {
  const { query } = useRouter();
  const [roomData, setRoomData] = useState<RoomType | null>(room);

  useEffect(() => {
    const code = query.code as string;
    socketService.joinEmit(code);
    socketService.joinRoom((data) => {
      setRoomData(data.room);
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
      <h3 className="text-lg">Participants: {roomData?.participants?.length || 0}</h3>
      <div className="flex gap-2">
        <div className="w-1/4">leaderboard</div>
        <div className="w-3/4 bg-zinc-500"></div>
      </div>
    </div>
  );
}

RoomPage.layout = TopNavLayout;

export default RoomPage;
