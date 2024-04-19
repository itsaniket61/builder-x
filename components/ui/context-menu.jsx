import { useEffect, useState } from 'react';

const ContextMenu = ({ options, position, onClose }) => {
    const [visibility,setVisibility] = useState('none');
    useEffect(() => {
        if(options){
            setVisibility('block');
        }else{
            setVisibility('none');
        }
    },[options])

  const handleClickOutside = (event) => {
    if (!event.target.closest('.context-menu')) {
        onClose();
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        height: '90vh',
        width: '100vw',
        top: 0,
        left: 0,
        display: visibility,
      }}
      onClick={handleClickOutside}
    >
      <div
        className='fixed w-1/6 z-50 bg-white border border-gray-300 shadow-lg rounded context-menu'
        style={{ top: position.y, left: position.x }}
        onClick={handleClickOutside}
      >
        {options &&
          options.map((option, index) => (
            <button
              key={index}
              className='p-4 block w-full text-left hover:bg-slate-100 rounded'
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
