import { PropsWithChildren, useRef, useState } from 'react';
import http from '../../http';
import JetButton from './button';
import JetDialogModal from './dialog-modal';
import JetInputError from './input-error';
import JetInput from './input';
import { ModalProps } from './modal';

export function useConfirmPassword() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const userCallback = useRef<() => any>(() => void 0);

  function onSuccess() {
    setVisible(false);
    userCallback.current?.();
  }

  return {
    withPasswordConfirmation(cb: () => void) {
      return async function () {
        setLoading(true);
        const { response } = await http('user/password-confirmation-status');
        setLoading(false);
        if (response.status === 423) {
          userCallback.current = cb;
          setVisible(true);
        } else {
          cb();
        }
      };
    },
    ConfirmPasswordModal: () => (
      <JetConfirmPasswordModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSuccess={onSuccess}
      />
    ),
    loading,
  };
}

interface Props extends ModalProps {
  title?: string;
  onSuccess(): void;
}

export default function JetConfirmPasswordModal({
  title = 'Confirm Password',
  children = 'For your security, please confirm your password to continue.',
  onSuccess,
  ...modalProps
}: PropsWithChildren<Props>) {
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ password: '' });
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const { ok, errors } = await http('user/confirm-password', {
      method: 'post',
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!ok) {
      return void setErrors(errors.errors);
    }
    modalProps.onClose();
    onSuccess();
  }

  return (
    <JetDialogModal
      {...modalProps}
      title={title}
      renderFooter={() => (
        <>
          <JetButton status={'secondary'} onClick={modalProps.onClose}>
            Nevermind
          </JetButton>

          <JetButton className="ml-2" onClick={submit} disabled={loading}>
            Ok
          </JetButton>
        </>
      )}
    >
      {children}

      <div className="mt-4">
        <JetInput
          type="password"
          className="mt-1 block w-3/4"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.currentTarget.value)}
        />

        <JetInputError className="mt-2">{errors.password}</JetInputError>
      </div>
    </JetDialogModal>
  );
}
