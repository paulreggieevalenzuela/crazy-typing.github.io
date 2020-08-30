import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Hooks
import useKeyPress from './hooks/useKeyPress';

// Components
import TextField from './components/TextField';
import TextAreaField from './components/TextAreaField';
import ButtonField from './components/ButtonField';
import Timer from './components/Timer';

import './app.scss';

const currentTime = () => new Date().getTime();

const App = () => {
    const textElement = useRef(null);
    const [initialWords, setInitialWords] = useState('');
    const [outgoingChars, setOutgoingChars] = useState('');
    const [currentChar, setCurrentChar] = useState('');
    const [incomingChars, setIncomingChars] = useState('');

    const [startTime, setStartTime] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const [wpm, setWpm] = useState(0);

    const [accuracy, setAccuracy] = useState(0);
    const [typedChars, setTypedChars] = useState('');
    const [textarea, setTextAreaValue] = useState('');

    const [finalTime, setFinalTime] = useState(0);

    const [isCorrect, setIsCorrect] = useState(true);
    const [isFinished, setFinished] = useState(false);

    const [reset, setReset] = useState(false);

    const _handleReset = () => {
        setInitialWords('');
        setOutgoingChars('');
        setIncomingChars('');
        setCurrentChar('');
        setTypedChars('');
        setTextAreaValue('');

        setStartTime(0);
        setFinalTime(0);

        setWordCount(0);
        setWpm(0);
        setAccuracy(0);

        setIsCorrect(true);
        setFinished(false);
        setReset(true);
    };

    useEffect(() => {
      if (textElement.current) {
        textElement.current.focus();
      }
    }, [typedChars]);

    const _request = () => {
        axios.get(`https://baconipsum.com/api/?type=meat-and-filler&paras=1&format=text`)
        .then(res => {
            setInitialWords(res.data.replace(/\s\s/g, ' '));
            setCurrentChar(res.data.replace(/\s\s/g, ' ').charAt(0));
            setIncomingChars(res.data.replace(/\s\s/g, ' ').substr(1));
        })
        .catch(err => {
            console.warn(err)
        })
    }

    useEffect(() => {
        _request();
    }, []);

    const _getFinalTime = (finalTime) => {
        setFinalTime(finalTime);
    }

    useKeyPress(key => {
        let updatedOutgoingChars = outgoingChars;
        let updatedIncomingChars = incomingChars;

        if (!startTime) {
            setStartTime(currentTime());
            setReset(false);
        }
        
        if (key === currentChar) {
            updatedOutgoingChars += currentChar;
            setOutgoingChars(updatedOutgoingChars);
            setCurrentChar(incomingChars.charAt(0));
            updatedIncomingChars = incomingChars.substring(1);
            setIncomingChars(updatedIncomingChars);
            setIsCorrect(true);
            if (incomingChars.charAt(0) === ' ') {
                setWordCount(wordCount + 1);
                const durationInMinutes = (currentTime() - startTime) / 60000.0;
                setWpm(((wordCount + 1) / durationInMinutes).toFixed(2));
            }
        } else {
            setIsCorrect(false);
        }

        const updatedTypedChars = typedChars + key;
        const completedValue = textElement.current.value + key;

        if (completedValue === initialWords) {
            setFinished(completedValue === initialWords);
        }
        setTypedChars(updatedTypedChars);
        setAccuracy(((updatedOutgoingChars.length * 100) / updatedTypedChars.length).toFixed(2));
    });
    
    return (
        <div className="app">
            <h1 className="container is-size-1 title">Crazy Typing!!!</h1>
            <div className="container">
                <div className="box">
                    <div className="flex">
                        <ButtonField 
                            text='Get Different Text' 
                            onClick={() => {
                                _handleReset();
                                _request();
                            }}
                        />
                    </div>
                    <TextField 
                        incomingChars={incomingChars} 
                        currentChar={currentChar} 
                        outgoingChars={outgoingChars} 
                    />
                </div>  
            </div>
            <div className="inputDisplay container">
                <div className="box">
                    <ButtonField 
                        text='Reset' 
                        onClick={() => {
                            _handleReset();
                            _request();
                        }}
                    />
                    <TextAreaField 
                        ref={textElement}
                        placeholder="Clock starts when you type"
                        className={`textarea ${isCorrect ? 'is-primary' : 'is-danger' }`}
                        disabled={isFinished}
                        onChange={(e) => setTextAreaValue(e.target.value)}
                        value={textarea}
                    />
                </div>
            </div>
            <div className="container">
                <div className="columns">
                    <div className="column is-6">
                        <div className="result box">
                            <span className={`result-display is-size-2 ${wpm ? "boing" : ""}`}>
                                WPM: {wpm} | ACC: {accuracy}%
                            </span>
                        </div>
                        
                    </div>
                    <div className="column is-6">
                        <div className="result box timer-display is-size-2">
                            {reset ? `${finalTime} seconds` :
                                <Timer 
                                    textEntered={textarea} 
                                    finished={isFinished}
                                    getFinalTime={_getFinalTime}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;