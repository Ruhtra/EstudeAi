import { ContentTable } from '../Table';
import { ContentActions, ContentActionsDelete, ContentActionsEdit, ContentActionsPublish } from './ContentActions';
import { ContentItemDesktop } from './ContentItemDesktop';
import { ContentItemMobile } from './ContentItemMobile';
import { ContentLayout } from './ContentLayout';
import { ContentRoot } from './ContentRoot';


export const Content = {
  Root: ContentRoot,
  Layout: ContentLayout,
  Item: {
    Mobile: ContentItemMobile,
    Desktop: ContentItemDesktop,
  },
  Table: ContentTable,
  Actions: ContentActions,
  ActionsEdit: ContentActionsEdit,
  ActionsDelete: ContentActionsDelete,
  ActionsPublish: ContentActionsPublish,
};
