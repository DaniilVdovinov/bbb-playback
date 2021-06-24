import React, { useEffect, useRef } from 'react';
import {
  defineMessages,
  useIntl,
} from 'react-intl';
import { chat as config } from 'config';
import Messages from './messages';
import {
  ID,
  getScrollTop,
} from 'utils/data';
import './index.scss';

const intlMessages = defineMessages({
  aria: {
    id: 'player.chat.wrapper.aria',
    description: 'Aria label for the chat wrapper',
  },
});

const Chat = (props) => {
  const interaction = useRef(false);
  const firstNode = useRef();
  const currentNode = useRef();

  const intl = useIntl();

  const setRef = (node, index) => {
    if (index === 0) {
      firstNode.current = node;
    }

    if (index === props.currentDataIndex) {
      currentNode.current = node;
    }
  };

  const handleAutoScroll = () => {
    if (interaction.current) return;

    const { current: fNode } = firstNode;
    const { current: cNode } = currentNode;

    // Auto-scroll can start after getting the first and current nodes
    if (fNode && cNode) {
      const { align } = config;
      const { parentNode: pNode } = cNode;

      pNode.scrollTop = getScrollTop(fNode, cNode, align);
    }
  };

  useEffect(() => config.scroll ? handleAutoScroll() : null);

  return (
    <div
      aria-label={intl.formatMessage(intlMessages.aria)}
      aria-live="polite"
      className="chat-wrapper"
      id={ID.CHAT}
      onMouseEnter={() => interaction.current = true}
      onMouseLeave={() => interaction.current = false}
      tabIndex="0"
    >
      <Messages
        chat={props.chat}
        currentDataIndex={props.currentDataIndex}
        player={props.player}
        setRef={(node, index) => setRef(node, index)}
      />
    </div>
  );
};

const areEqual = (prevProps, nextProps) => {
  if (prevProps.currentDataIndex !== nextProps.currentDataIndex) return false;

  if (!prevProps.player && nextProps.player) return false;

  return true;
};

export default React.memo(Chat, areEqual);
