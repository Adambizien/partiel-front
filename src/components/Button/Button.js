import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ text, onClick, type = 'button', className = '' }) => {
    return (
        <button 
            type={type} 
            onClick={onClick} 
            className={`btn ${className}`}
        >
            {text}
        </button>
    );
};

Button.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.string,
    className: PropTypes.string,
};

export default Button;
