import { useEffect, useState } from 'react';

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

    const maxLeft = window.innerWidth - 200;

    const maxTop = window.innerHeight - options?.length * 50;

    return (
        <div
            style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                top: 0,
                left: 0,
                display: visibility,
            }}
            onClick={handleClickOutside}
        >
            <div
                className='fixed z-50 bg-white border border-gray-300 shadow-lg rounded context-menu'
                style={{
                    top: Math.min(position.y, maxTop),
                    left: Math.min(position.x, maxLeft),
                }}
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
