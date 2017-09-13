

// @flow
// https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces
import React from 'react';

type Props = {
  width: number | string,
  height: number | string,
};

const WhiteRook = ({
  width,
  height,
}: Props) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 45 45"
  >
    <g
      style={{
        opacity:1,
        fill: '#ffffff',
        fillOpacity: 1,
        fillRule: 'evenodd',
        stroke: '#000000',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeMiterlimit: 4,
        strokeDasharray: 'none',
        strokeOpacity: 1,
      }}
    >
      <path
        d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z "
        style={{ strokeLinecap: 'butt' }}
      />
      <path
        d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z "
        style={{ strokeLinecap: 'butt' }}
      />
      <path
        d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14"
        style={{ strokeLinecap: 'butt' }}
      />
      <path d="M 34,14 L 31,17 L 14,17 L 11,14"/>
      <path
        d="M 31,17 L 31,29.5 L 14,29.5 L 14,17"
        style={{ strokeLinecap: 'butt', strokeLinejoin: 'miter' }}
      />
      <path d="M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5" />
      <path
        d="M 11,14 L 34,14"
        style={{ fill: 'none', stroke: '#000000', strokeLinejoin: 'miter' }}
      />
    </g>
  </svg>
);

WhiteRook.defaultProps = {
  width: 100,
  height: 100,
};

export default WhiteRook;
