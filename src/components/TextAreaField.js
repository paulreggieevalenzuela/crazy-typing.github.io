import React from 'react';

const TextAreaField = React.forwardRef((props, ref) => (
    <div className="field">
        <div className="control">
            <textarea 
                ref={ref}
                {...props}
                autoFocus={true}
                type="textarea"
                rows="5"
            />
        </div>
    </div>
));

export default TextAreaField;