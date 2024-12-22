import { TopNav } from '@/components/TopNav/TopNav';
import { useSignInDialogCommit, useSignInDialoggSelector } from '@/contexts/signin.context';
import { Modal } from '@/components/Modal/Modal';
import { ChangeEvent, ReactNode, useState } from 'react';
import { TextField } from '@mui/material';
import { getUserProfile, login } from '@/services/auth.service';
import { useUserProfileCommit } from '@/contexts/userProfile.context';
import { joinRoom } from '@/services/room.service';
import { useRouter } from 'next/router';

enum Mode {
  signin = 'signin',
  register = 'register',
}

export const TopNavLayout = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter();
  const openSignInDialog = useSignInDialoggSelector((store) => store.openSignInDialog);
  const openJoinRoomDialog = useSignInDialoggSelector((store) => store.openJoinRoomDialog);
  const commit = useSignInDialogCommit();
  const userProfileCommit = useUserProfileCommit();
  const [signInContent, setSignInContent] = useState({
    username: '',
    password: '',
  });
  const [registerContent, setRegisterContent] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [code, setCode] = useState('');

  const [mode, setMode] = useState<Mode>(Mode.signin);

  const handleCloseDialog = () => {
    commit({ openSignInDialog: false });
  };

  const handleCloseRoomCodeDialog = () => {
    commit({ openJoinRoomDialog: false });
  };

  const handleChangeMode = (val: Mode) => () => {
    setMode(val);
  };

  const handleChangeSignInContent = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSignInContent((pre) => ({
      ...pre,
      [id]: value,
    }));
  };

  const handleChangeRegisterContent = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegisterContent((pre) => ({
      ...pre,
      [id]: value,
    }));
  };

  const handleChangeCode = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = async () => {
    if (mode === Mode.signin) {
      await login(signInContent);
      const profile = await getUserProfile();
      userProfileCommit({
        profile,
      });
      handleCloseDialog();
    }
  };

  const handleJoinRoom = async () => {
    try {
      await joinRoom(code);
      handleCloseRoomCodeDialog();
      push(`/rooms/${code}`);
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
        onSubmit={handleSubmit}
        onClose={handleCloseDialog}
      >
        {mode === Mode.signin ? (
          <>
            <TextField
              autoFocus
              required
              margin="normal"
              id="username"
              name="username"
              label="Username"
              fullWidth
              variant="standard"
              value={signInContent.username}
              onChange={handleChangeSignInContent}
            />
            <TextField
              required
              margin="normal"
              id="password"
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              value={signInContent.password}
              onChange={handleChangeSignInContent}
            />
          </>
        ) : (
          <>
            <TextField
              autoFocus
              required
              margin="normal"
              id="username"
              name="username"
              label="Username"
              fullWidth
              variant="standard"
              value={registerContent.username}
              onChange={handleChangeRegisterContent}
            />
            <TextField
              margin="normal"
              id="email"
              name="email"
              label="Email"
              fullWidth
              variant="standard"
              value={registerContent.email}
              onChange={handleChangeRegisterContent}
            />
            <TextField
              required
              margin="normal"
              id="password"
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              value={registerContent.password}
              onChange={handleChangeRegisterContent}
            />
            <TextField
              required
              margin="normal"
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm password"
              type="password"
              fullWidth
              variant="standard"
              value={registerContent.confirmPassword}
              onChange={handleChangeRegisterContent}
            />
          </>
        )}
      </Modal>
      <Modal
        title="Join Room"
        open={openJoinRoomDialog}
        submitButtonText="Enter"
        onSubmit={handleJoinRoom}
        onClose={handleCloseRoomCodeDialog}
      >
        <TextField
          required
          id="code"
          name="code"
          label="Room Code"
          fullWidth
          variant="standard"
          value={code}
          onChange={handleChangeCode}
        />
      </Modal>
    </>
  );
};
