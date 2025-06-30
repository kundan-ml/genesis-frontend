import React from 'react';
import './card.css';

const Card = () => {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <p className="heading_8264">MASTERCARD</p>
          <svg className="logo" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 48 48">
            <path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"></path>
            <path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"></path>
            <path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"></path>
          </svg>
          <svg className="chip" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 50 50" xmlSpace="preserve">
            <image id="chip" width="50" height="50" x="0" y="0" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAmJLR0Q..."></image>
          </svg>
          <svg className="contactless" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 50 50" xmlSpace="preserve">
            <image id="contactless" width="50" height="50" x="0" y="0" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAmJLR0Q..."></image>
          </svg>
          <p className="number">9759 2484 5269 6576</p>
          <p className="valid_thru">VALID THRU</p>
          <p className="date_8264">1 2 / 2 4</p>
          <p className="name">BRUCE WAYNE</p>
        </div>
        <div className="flip-card-back">
          <div className="strip"></div>
          <div className="mstrip"></div>
          <div className="sstrip">
            <p className="code">***</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
