import { useCallback, useEffect, useState } from "react";
import styles from "./Hangman.module.scss";

const PHRASES = [
    "What is a taco without the guaco?",
    "Please tell me you brought pizza...",
    "I married a painting.",
    "Virtual virtual-reality is virtually a reality.",
    "One loop, two loop, three loop, four loop, I declare loop a thumb loop war loop.",
    "This statement isn't not not a lie, not!"
];

function getRandomPhrase() {
    const index = Math.floor(Math.random() * PHRASES.length);
    return PHRASES[index];
}

/**
 * returns whether the character is a letter
 * (also returns false for strings not of length 1)
 */
const isLetter = (c: string) => /^[A-Za-z]$/.test(c);

/**
 * returns true if the character should be hidden, otherwise false
 * note: all guessed letters are stored as lower case letters
 * @param c the character
 * @param guessedLetters letters which have been guessed so far
 */
function isCharacterHidden(c: string, guessedLetters: string[]): boolean {
    if (guessedLetters.includes(c.toLowerCase())) return false;
    // c has not been guessed, only hide it if it is a letter
    return isLetter(c);
}

/**
 * takes the secret phrase and returns a partially revealed version of it
 * based on what letters have been guessed so far
 * @param secretPhrase
 * @param guessedLetters
 */
function getRevealedPhrase(secretPhrase: string, guessedLetters: string[]) {
    return secretPhrase
        .split("") // turn secret phrase into array of 1-length strings
        .map(c => isCharacterHidden(c, guessedLetters) ? "_" : c) // map these characters to underscore if necessary
        .join(""); // join the characters back into a single string
}

// how many body parts does the man being hung start with
const DEFAULT_BODY_PART_COUNT = 5;

// This interface is for string localization. See note below...
interface Strings {
    instructions: string;
    youWin: string;
    youLose: string;
    goodGuess: string;
    badGuess: string;
    bodyPartsRemainingLabel: string;
    guessedLettersLabel: string;
}

/*
One reason you might want to define your display strings in objects like this
is for localization - it will be easy to render your app in different languages.
This is just an example of what that might look like - the example is not complete because it
doesn't handle some of the dynamically generated strings;
*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const STRINGS_EN: Strings = {
    instructions: "Don't let the chap die!",
    youWin: "You are a life saver!",
    youLose: "You did not save the poor chap's life.",
    goodGuess: "Good guess!",
    badGuess: "That's gotta hurt!",
    bodyPartsRemainingLabel: "Body parts remaining",
    guessedLettersLabel: "Guessed letters",
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const STRINGS_DE: Strings = {
    instructions: "Lass er nicht sterben!",
    youWin: "Du hast gewonnen!",
    youLose: "Schade! Er ist gestorben.",
    goodGuess: "Wunderbar!",
    badGuess: "Kein Glück!",
    bodyPartsRemainingLabel: "Verbleibende Körperteile",
    guessedLettersLabel: "Erraten Buchstaben",
}

// in a real app you would likely determine which set of strings to use based on a cookie or url parameter
// instead of hardcoding it:
const STRINGS = STRINGS_DE;

export function Hangman(): JSX.Element {
    const [secretPhrase, setSecretPhrase] = useState("");
    const [revealedPhrase, setRevealedPhrase] = useState("");
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
    const [feedback, setFeedback] = useState("");
    const [bodyPartsRemaining, setBodyPartsRemaining] = useState(-1);
    const [gameOver, setGameOver] = useState(true);
    // "letter" is just the value of the text input / your guess before it is added to guessedLetters
    const [letter, setLetter] = useState("");

    // this callback sets up a new game
    const startNewGame = useCallback(() => {
        setFeedback("");
        setGuessedLetters([]);
        setBodyPartsRemaining(DEFAULT_BODY_PART_COUNT);
        setLetter("");
        setSecretPhrase(getRandomPhrase());
        setRevealedPhrase("");
        setGameOver(false);
    }, []);

    // this effect runs one time only -- will start a new game when component first renders
    useEffect(() => {
        startNewGame();
    }, [startNewGame]); // startNewGame will never change but my IDE is mad at me if I don't add it here anyways

    // update revealed phrase whenever a new guess is made (or when secretPhrase is changed)
    useEffect(() => {
        setRevealedPhrase(getRevealedPhrase(secretPhrase, guessedLetters));
    }, [secretPhrase, guessedLetters]);

    // check whether game is over when the relevant state is updated (state in the dependency array)
    useEffect(() => {
        if (bodyPartsRemaining === -1) {
            // game not initialized
            return;
        }
        if (bodyPartsRemaining === 0) {
            setFeedback(STRINGS.youLose);
            setGameOver(true);
        } else if (revealedPhrase === secretPhrase) {
            setFeedback(STRINGS.youWin);
            setGameOver(true);
        }
    }, [bodyPartsRemaining, secretPhrase, revealedPhrase]);

    const guessLetter = useCallback((letter) => {
        // ensure user has guessed a letter, not punctuation etc
        if (!isLetter(letter)) {
            setFeedback(`'${letter}' is not a letter!`);
            return;
        }
        // ensure user has not already guessed this letter,
        if (guessedLetters.includes(letter)) {
            setFeedback(`You have already guessed '${letter}'!`);
            return;
        }

        // GREAT, user has not guessed this letter
        // was it a good guess?
        const goodGuess = secretPhrase.includes(letter);
        if (!goodGuess) {
            setBodyPartsRemaining(prev => prev - 1);
            setFeedback(STRINGS.badGuess);
        } else {
            setFeedback(STRINGS.goodGuess);
        }

        // user has not guessed this letter, so add it to the guessed letters array
        setGuessedLetters(prev => {
            // set guessed letters to a copy of the previous array, with one element added
            // React requires us to not mutate the previous state directly,
            // which is why we have to make a copy first
            const newGuessedLetters = prev.slice();
            newGuessedLetters.push(letter);
            return newGuessedLetters;
        });

    }, [secretPhrase, guessedLetters]); // callback depends on secretPhrase and guessedLetters

    const onGuessClick = useCallback(() => {
        guessLetter(letter.toLowerCase());
        setLetter("");
    }, [guessLetter, letter]); // this callback depends on the guessLetter callback and letter

    return <div>
        <h6>{STRINGS.instructions}</h6>
        <div>{feedback}</div>
        <div>
            {
                // split the phrase into words so that we can put each word inside a span tag for styling purposes
                revealedPhrase.split(" ").map(word => {
                    // used split / join on each word to add extra spacing
                    return <span className={styles.word}>{word}</span>;
                })
            }
        </div>
        <div>{STRINGS.bodyPartsRemainingLabel}: {bodyPartsRemaining}</div>
        <div>{STRINGS.guessedLettersLabel}: [{guessedLetters.join(", ")}]</div>
        <div>{
            // If game is over, show "New Game" button, otherwise show guess input
            // If this syntax looks alien, learn about the ternary operator here:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
            gameOver ? <>
                <button onClick={startNewGame}>New Game</button>
            </> : <>
                <input
                    className={styles.letterInput}
                    value={letter}
                    onChange={event => setLetter(event.target.value)}
                    maxLength={1}
                    onKeyDown={event => {
                        if (event.key === "Enter") onGuessClick();
                    }}
                />
                <button onClick={onGuessClick}>Guess</button>
            </>
        }</div>
    </div>;
}
