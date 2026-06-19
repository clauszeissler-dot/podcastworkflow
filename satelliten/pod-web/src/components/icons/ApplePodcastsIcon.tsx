import { forwardRef } from 'react';

const ApplePodcastsIcon = forwardRef<SVGSVGElement, { className?: string }>(
  ({ className }, ref) => (
    <svg ref={ref} className={className} viewBox="0 0 50 50" fill="currentColor">
      <path d="M25 2C12.3 2 2 12.3 2 25s10.3 23 23 23 23-10.3 23-23S37.7 2 25 2zm0 4c10.5 0 19 8.5 19 19s-8.5 19-19 19S6 35.5 6 25 14.5 6 25 6zm0 6c-7.2 0-13 5.8-13 13 0 4.1 1.9 7.8 4.9 10.2.4.3.9.2 1.2-.2.3-.4.2-.9-.2-1.2-2.5-2-4-5.1-4-8.5 0-6.1 4.9-11 11-11s11 4.9 11 11c0 3.4-1.5 6.5-4 8.5-.4.3-.5.8-.2 1.2.3.4.8.5 1.2.2 3-2.4 4.9-6.1 4.9-10.2.1-7.2-5.7-13-12.8-13zm0 6c-3.9 0-7 3.1-7 7 0 2.4 1.2 4.5 3 5.8v8.5c0 1.9 1.5 3.4 3.4 3.7h1.2c1.9-.3 3.4-1.8 3.4-3.7v-8.5c1.8-1.3 3-3.4 3-5.8 0-3.9-3.1-7-7-7zm0 4c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z"/>
    </svg>
  )
);

ApplePodcastsIcon.displayName = 'ApplePodcastsIcon';

export default ApplePodcastsIcon;
