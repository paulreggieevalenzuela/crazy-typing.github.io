import React from 'react';

const TextField = ({ outgoingChars, currentChar, incomingChars }) => (
    <div className="field field__button">
        <p className="character">
            <span className="character-out">
                {outgoingChars}
            </span>
            <span className="character-current">{currentChar}</span>
            <span>{incomingChars}</span>
        </p>
    </div>
);

export default TextField;