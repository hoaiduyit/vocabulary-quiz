import { createFastContext } from '@/helpers/createFastContext';
import { UserType } from '@/types/user.type';

interface IUserProfile {
  profile: UserType | null;
  fetching: boolean;
}

const defaultState: IUserProfile = {
  profile: null,
  fetching: true,
};

export const {
  Provider: UserProfileProvider,
  useCommit: useUserProfileCommit,
  useSelector: useUserProfileSelector,
} = createFastContext<IUserProfile>(defaultState);
