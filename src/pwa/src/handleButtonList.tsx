import MdClose from '@material-design-icons/svg/round/close.svg';

import { t } from 'helper/i18n';
import { IconButton } from '../../components/IconButton';
import type { MangaProps } from '../../components/Manga';
import { buttonListDivider } from '../../components/Manga';
import { DownloadButton } from '../../components/useComponents/DownloadButton';
import { handleExit } from './store';

const ExitButton = () => (
  <IconButton tip={t('button.exit')} onClick={handleExit}>
    <MdClose />
  </IconButton>
);

export const editButtonList: MangaProps['editButtonList'] = (list) => {
  // 在设置按钮上方放置下载按钮
  list.splice(-1, 0, DownloadButton);
  return [
    ...list,
    // 再在最下面添加分隔栏和退出按钮
    buttonListDivider,
    ExitButton,
  ];
};
