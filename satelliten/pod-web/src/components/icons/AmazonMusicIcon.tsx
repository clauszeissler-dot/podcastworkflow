import { forwardRef } from 'react';

const AmazonMusicIcon = forwardRef<SVGSVGElement, { className?: string }>(
  ({ className }, ref) => (
    <svg ref={ref} className={className} viewBox="0 0 24 24" fill="currentColor">
      {/* Amazon smile/arrow */}
      <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595.427-.16.764-.054.96.32.18.333.09.672-.285.907C18.315 22.4 14.715 23 11.042 23 6.463 23 2.298 21.667.045 18.02z"/>
      <path d="M2.494 15.948c-.09-.137-.02-.24.178-.31 1.36-.503 2.778-.754 4.254-.754 2.18 0 4.09.51 5.73 1.53.21.13.21.28-.02.47-.23.19-.52.22-.83.07-1.5-.69-3.14-1.04-4.93-1.04-1.32 0-2.63.21-3.93.63-.23.08-.4.03-.45-.13v-.47z"/>
      {/* Music note */}
      <path d="M17.5 3v9.5a3 3 0 1 1-2-2.83V5.5L10 6.72V13a3 3 0 1 1-2-2.83V4.28a1 1 0 0 1 .757-.97l8-2A1 1 0 0 1 18 2.28V3h-.5z"/>
    </svg>
  )
);

AmazonMusicIcon.displayName = 'AmazonMusicIcon';

export default AmazonMusicIcon;
