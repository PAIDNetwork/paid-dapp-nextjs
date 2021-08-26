import React, { FC, useState } from 'react';
import { Tooltip } from 'reactstrap';

const socialMedias = [
  {
    id: 'twitter',
    icon: 'twitter.svg',
    href: 'https://twitter.com/paid_network',
    tooltip: '@paid_network',
  },
  {
    id: 'linkedin',
    icon: 'linkedin.svg',
    href: 'https://www.linkedin.com/company/paid-network',
    tooltip: '@paid-network',
  },
  {
    id: 'medium',
    icon: 'medium.svg',
    href: 'https://paidnetwork.medium.com/',
    tooltip: '@paidnetwork',
  },
  {
    id: 'github',
    icon: 'github.svg',
    href: 'https://github.com/paidnetwork',
    tooltip: '@paidnetwork',
  },
  {
    id: 'telegram',
    icon: 'telegram.svg',
    href: 'https://t.me/paidnetwork',
    tooltip: '@paidnetwork',
  },
];
const SocialMedia: FC = () => {
  const [toolTipTarget, setToolTipTarget] = useState<any>();

  return (
    <div className="socialmedia-container">
      {
      socialMedias.map((item) => (
        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
        <a
          id={item.id}
          target="__blank"
          href={item.href}
          onMouseOver={() => setToolTipTarget(item)}
          onMouseLeave={() => setToolTipTarget(undefined)}
        >
          <img src={`/assets/icon/social/${item.icon}`} alt="" />
        </a>
      ))
      }
      {toolTipTarget && (
        <Tooltip
          placement="bottom"
          isOpen={!!toolTipTarget}
          target={toolTipTarget.id}
        >
          {toolTipTarget.tooltip}
        </Tooltip>
      )}
    </div>
  );
};

export default SocialMedia;
