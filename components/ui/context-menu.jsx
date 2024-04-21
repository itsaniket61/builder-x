import React, { useEffect, useState } from 'react';

const ContextMenu = ({ options, position, onClose }) => {
  const [visibility, setVisibility] = useState('none');

  useEffect(() => {
    if (options) {
      setVisibility('block');
    } else {
      setVisibility('none');
    }
  }, [options]);

  const handleClickOutside = (event) => {
    if (!event.target.closest('.context-menu')) {
      onClose();
    }
  };

  const menuHeight = options ? options.length * 70 : 0; // Assuming each option has a height of 50px
  const maxLeft = window.innerWidth - 120 ;
  const maxTop = window.innerHeight - menuHeight;

  return (
    <div
      className='absolute w-screen top-0 left-0'
      style={{
        height: document.body.scrollHeight + 'px',
        display: visibility,
      }}
      onClick={handleClickOutside}
    >
      <div
        className='fixed z-50 bg-white border border-gray-300 dark:bg-gray-900 dark:border-gray-600 shadow-lg rounded context-menu'
        style={{
          width: '120px',
          top: Math.min(position.y, maxTop),
          left: Math.min(position.x, maxLeft),
        }}
        onClick={handleClickOutside}
      >
        {options &&
          options.map((option, index) => (
            <button
              key={index}
              className='p-4 block w-full text-left hover:bg-slate-100 dark:hover:bg-slate-800 rounded'
              onClick={() => {
                option.action();
                onClose();
              }}
            >
              {option.label}
            </button>
          ))}
      </div>
    </div>
  );
};

export default ContextMenu;
