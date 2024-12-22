export type ParticipantType = {
  id: string;
  displayName: string;
};

export type RoomType = {
  id: string;
  code: string;
  hostId: string;
  status: string;
  createdAt: string;
  participants: ParticipantType[];
};
