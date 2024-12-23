import { TopNav } from '@/components/TopNav/TopNav';
import { useSignInDialogCommit, useSignInDialoggSelector } from '@/contexts/signin.context';
import { Modal } from '@/components/Modal/Modal';
import { ChangeEvent, FocusEvent, ReactNode, useState } from 'react';
import { TextField } from '@mui/material';
import { getUserProfile, login, loginAsGuest, register } from '@/services/auth.service';
import { useUserProfileCommit, useUserProfileSelector } from '@/contexts/userProfile.context';
import { joinRoom } from '@/services/room.service';
import { useRouter } from 'next/router';

enum Mode {
  signin = 'signin',
  register = 'register',
}

type InputType = {
  [key: string]: {
    value: string;
    isDirty?: boolean;
    errorMsg?: string;
  };
};

const signInDefaultValue: InputType = {
  username: {
    value: '',
    isDirty: false,
    errorMsg: '',
  },
  password: {
    value: '',
    isDirty: false,
    errorMsg: '',
  },
};
const registerDefaultValue: InputType = {
  username: {
    value: '',
    isDirty: false,
    errorMsg: '',
  },
  email: {
    value: '',
    isDirty: false,
    errorMsg: '',
  },
  password: {
    value: '',
    isDirty: false,
    errorMsg: '',
  },
  confirmPassword: {
    value: '',
    isDirty: false,
    errorMsg: '',
  },
};

const signInComps = [
  {
    id: 'username',
    label: 'Username',
    required: true,
    autoFocus: true,
  },
  {
    id: 'password',
    label: 'Password',
    required: true,
    autoFocus: false,
  },
];

const registerComps = [
  {
    id: 'username',
    label: 'Username',
    required: true,
    autoFocus: true,
  },
  {
    id: 'email',
    label: 'Email',
  },
  {
    id: 'password',
    label: 'Password',
    required: true,
  },
  {
    id: 'confirmPassword',
    label: 'Confirm Password',
    required: true,
  },
];

export const TopNavLayout = ({ children }: { children: ReactNode }) => {
  const { push, query } = useRouter();
  const profile = useUserProfileSelector((store) => store.profile);
  const openSignInDialog = useSignInDialoggSelector((store) => store.openSignInDialog);
  const openJoinRoomDialog = useSignInDialoggSelector((store) => store.openJoinRoomDialog);
  const commit = useSignInDialogCommit();
  const userProfileCommit = useUserProfileCommit();
  const [signInContent, setSignInContent] = useState<InputType>(signInDefaultValue);
  const [registerContent, setRegisterContent] = useState<InputType>(registerDefaultValue);
  const [code, setCode] = useState<InputType[0]>({
    value: (query.code as string) || '',
    isDirty: false,
    errorMsg: '',
  });
  const [displayName, setDisplayName] = useState<InputType[0]>({
    value: '',
    isDirty: false,
    errorMsg: '',
  });
  const [mode, setMode] = useState<Mode>(Mode.signin);

  const handleCloseDialog = () => {
    commit({ openSignInDialog: false });
    setSignInContent(signInDefaultValue);
    setRegisterContent(registerDefaultValue);
  };

  const handleCloseRoomCodeDialog = () => {
    commit({ openJoinRoomDialog: false });
    setCode(signInDefaultValue.username);
    setDisplayName(signInDefaultValue.username);
  };

  const handleChangeMode = (val: Mode) => () => {
    setMode(val);
    if (val === Mode.signin) {
      setSignInContent(signInDefaultValue);
    } else {
      setRegisterContent(registerDefaultValue);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    switch (mode) {
      case Mode.signin:
        setSignInContent((pre) => ({
          ...pre,
          [id]: {
            value,
          },
        }));
        break;
      case Mode.register:
        setRegisterContent((pre) => ({
          ...pre,
          [id]: {
            value,
          },
        }));
        break;
      default:
        break;
    }
  };

  const onFocus = (e: FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    switch (mode) {
      case Mode.signin:
        setSignInContent(
          (pre) =>
            ({
              ...pre,
              [id]: {
                value,
              },
            }) as InputType,
        );
        break;
      case Mode.register:
        setRegisterContent((pre) => ({
          ...pre,
          [id]: {
            value,
          },
        }));
        break;
      default:
        break;
    }
  };

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { id, value, required } = e.target;
    switch (mode) {
      case Mode.signin:
        setSignInContent(
          (pre) =>
            ({
              ...pre,
              [id]: {
                value,
                isDirty: required && !value,
                errorMsg: required && !value ? `${id} is required` : '',
              },
            }) as InputType,
        );
        break;
      case Mode.register:
        setRegisterContent(
          (pre) =>
            ({
              ...pre,
              [id]: {
                value,
                isDirty: required && !value,
                errorMsg: required && !value ? `${id} is required` : '',
              },
            }) as InputType,
        );
        break;
      default:
        break;
    }
  };

  const handleChangeCode = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCode({
      value: val,
      isDirty: !val,
      errorMsg: !val ? 'Code is required' : '',
    });
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDisplayName({
      value: e.target.value,
      isDirty: !val,
      errorMsg: !val ? 'Name is required' : '',
    });
  };

  const onFocusJoinRoomFields =
    (field: 'code' | 'displayName') => (e: FocusEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (field === 'code') {
        setCode({
          value: val,
          isDirty: false,
          errorMsg: '',
        });
      } else {
        setDisplayName({
          value: val,
          isDirty: false,
          errorMsg: '',
        });
      }
    };

  const onBlurJoinRoomFields =
    (field: 'code' | 'displayName') => (e: FocusEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (field === 'code') {
        setCode({
          value: val,
          isDirty: !val,
          errorMsg: !val ? 'Code is required' : '',
        });
      } else {
        setDisplayName({
          value: val,
          isDirty: !val,
          errorMsg: !val ? 'Name is required' : '',
        });
      }
    };

  const isSubmitButtonDisabled = () => {
    switch (mode) {
      case Mode.signin:
        return Object.keys(signInContent).some(
          (item) => signInContent[item].isDirty || !signInContent[item].value,
        );
      case Mode.register:
        return Object.keys(registerContent).some(
          (item) => registerContent[item].isDirty || !registerContent[item].value,
        );
      default:
        return false;
    }
  };

  const isJoinRoomButtonDisabled = profile
    ? (code.isDirty || !code.value) && (displayName.isDirty || !displayName.value)
    : code.isDirty || !code.value;

  const onFetchUserProfile = async () => {
    const profile = await getUserProfile();
    userProfileCommit({
      profile,
    });
  };

  const handleSubmit = async () => {
    if (isSubmitButtonDisabled()) return;
    switch (mode) {
      case Mode.signin:
        await login({
          username: signInContent.username.value,
          password: signInContent.password.value,
        });
        await onFetchUserProfile();
        handleCloseDialog();
        break;
      case Mode.register:
        await register({
          username: registerContent.username.value,
          email: registerContent.email.value,
          password: registerContent.password.value,
          confirmPassword: registerContent.confirmPassword.value,
        });
        await onFetchUserProfile();
        handleCloseDialog();
      default:
        break;
    }
  };

  const handleJoinRoom = async () => {
    if (profile && (code.isDirty || displayName.isDirty)) return;
    if (code.isDirty) return;
    try {
      if (!profile) {
        await loginAsGuest(displayName.value);
      }
      await onFetchUserProfile();
      await joinRoom(code.value);
      handleCloseRoomCodeDialog();
      if (!query.code) {
        push(`/rooms/${code.value}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TopNav />
      <div className="h-screen" style={{ paddingTop: 80 }}>
        {children}
      </div>
      <Modal
        title={
          <div className="flex gap-2">
            <div
              role="button"
              tabIndex={0}
              className={`${mode === Mode.signin ? 'text-sky-500' : 'text-black cursor-pointer'}`}
              onClick={handleChangeMode(Mode.signin)}
            >
              Sign-In
            </div>
            /
            <div
              role="button"
              tabIndex={0}
              className={mode === Mode.register ? 'text-sky-500' : 'text-black cursor-pointer'}
              onClick={handleChangeMode(Mode.register)}
            >
              Register
            </div>
          </div>
        }
        open={openSignInDialog}
        submitButtonText={mode === Mode.signin ? 'Sign-in' : 'Register'}
        disabledSubmitButton={isSubmitButtonDisabled()}
        onSubmit={handleSubmit}
        onClose={handleCloseDialog}
      >
        {mode === Mode.signin ? (
          <>
            {signInComps.map((comp) => (
              <TextField
                {...comp}
                key={comp.id}
                margin="normal"
                name={comp.id}
                fullWidth
                variant="standard"
                helperText={signInContent[comp.id].errorMsg}
                error={signInContent[comp.id].isDirty}
                value={signInContent[comp.id].value}
                onChange={handleChange}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            ))}
          </>
        ) : (
          <>
            {registerComps.map((comp) => (
              <TextField
                {...comp}
                key={comp.id}
                margin="normal"
                name={comp.id}
                fullWidth
                variant="standard"
                error={registerContent[comp.id].isDirty}
                helperText={registerContent[comp.id].errorMsg}
                value={registerContent[comp.id].value}
                onChange={handleChange}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            ))}
          </>
        )}
      </Modal>
      <Modal
        title="Join Room"
        open={openJoinRoomDialog}
        submitButtonText="Enter"
        onSubmit={handleJoinRoom}
        disabledSubmitButton={isJoinRoomButtonDisabled}
        onClose={handleCloseRoomCodeDialog}
      >
        {!profile && (
          <TextField
            required
            id="name"
            name="name"
            label="Name"
            fullWidth
            variant="standard"
            error={displayName.isDirty}
            helperText={displayName.errorMsg}
            value={displayName.value}
            onChange={handleChangeName}
            onFocus={onFocusJoinRoomFields('displayName')}
            onBlur={onBlurJoinRoomFields('displayName')}
          />
        )}
        {!query.code && (
          <TextField
            required
            id="code"
            margin="normal"
            name="code"
            label="Room Code"
            fullWidth
            variant="standard"
            error={code.isDirty}
            helperText={code.errorMsg}
            value={code.value}
            onChange={handleChangeCode}
            onFocus={onFocusJoinRoomFields('code')}
            onBlur={onBlurJoinRoomFields('code')}
          />
        )}
      </Modal>
    </>
  );
};
