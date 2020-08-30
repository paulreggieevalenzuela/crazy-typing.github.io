import React from 'react';

const ButtonField = ({ text, onClick }) => (
    <div className="field field__button">
        <div className="control">
            <button className="button" onClick={onClick}>
                {text}
            </button>
        </div>
    </div>
);

export default ButtonField;