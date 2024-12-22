import { createFastContext } from '@/helpers/createFastContext';

interface ISignInDialog {
  openSignInDialog: boolean;
  openJoinRoomDialog: boolean;
}

const defaultState: ISignInDialog = {
  openSignInDialog: false,
  openJoinRoomDialog: false,
};

export const {
  Provider: SignInDialogProvider,
  useCommit: useSignInDialogCommit,
  useSelector: useSignInDialoggSelector,
} = createFastContext<ISignInDialog>(defaultState);
