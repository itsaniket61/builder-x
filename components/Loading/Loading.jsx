import React from 'react';

function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <svg
        width='100'
        height='100'
        viewBox='0 0 100 100'
        preserveAspectRatio='xMidYMid'
        style={{ background: 'none' }}
      >
        <circle
          cx='50'
          cy='50'
          fill='none'
          stroke='#007bff'
          strokeWidth='10'
          r='35'
          strokeDasharray='164.93361431346415 56.97787143782138'
          transform='rotate(241.38 50 50)'
        >
          <animateTransform
            attributeName='transform'
            type='rotate'
            repeatCount='indefinite'
            dur='1s'
            values='0 50 50;360 50 50'
            keyTimes='0;1'
          />
        </circle>
      </svg>
    </div>
  );
}

export default Loading;
