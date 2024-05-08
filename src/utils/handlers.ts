import { type Dialog } from 'playwright';

export const dialogHandler = (dialog: Dialog) => {
  dialog.accept().catch(() => {
    console.error('Dialog was already closed when dismissed');
  });
};
