import React from 'react';

import ListItemLink from '../../../components/ListItemLink';
import ListItem from '../../../components/ListItem';

const StandardsLHSListItem = ({
  isActive,
  onClick,
  href,
  className,
  title,
  issueNumber,
  isDeleted,
  deletedByText,
  deletedAtText,
  unreadMessagesCount,
  isNew,
  type = {},
}) => (
  <ListItemLink
    isActive={isActive}
    onClick={onClick}
    href={href}
  >
    <ListItem className={className}>
      <ListItem.Heading>
        <span>{title}</span>

        {isNew && (
          <span className="label label-primary">New</span>
        )}

        {status === 'draft' && (
          <span className="label label-danger">
            {`Issue ${issueNumber} Draft`}
          </span>
        )}
      </ListItem.Heading>
      {isDeleted && (
        <ListItem.RightText>
          {`Deleted by ${deletedByText}`}
        </ListItem.RightText>
      )}
      {unreadMessagesCount && (
        <ListItem.RightText className="text-danger">
          <i className="fa fa-comments"></i>
          {unreadMessagesCount}
        </ListItem.RightText>
      )}
      <ListItem.LeftText>
        {type.title}
      </ListItem.LeftText>
      {isDeleted && (
        <ListItem.RightText>
          {deletedAtText}
        </ListItem.RightText>
      )}
    </ListItem>
  </ListItemLink>
);

export default StandardsLHSListItem;
