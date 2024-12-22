import { createFastContext } from '@/helpers/createFastContext';
import { UserType } from '@/types/user.type';

interface IUserProfile {
  profile: UserType | null;
}

const defaultState: IUserProfile = {
  profile: null,
};

export const {
  Provider: UserProfileProvider,
  useCommit: useUserProfileCommit,
  useSelector: useUserProfileSelector,
} = createFastContext<IUserProfile>(defaultState);
