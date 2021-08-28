import { useCallback, useState } from "react";
import { isNullOrEmpty } from "../../model/util";

import { publicURL } from "../../config/site.json";

import styles from "./ContactPage.module.scss";

import $ from "jquery";

export function ContactPage(): JSX.Element {
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const onSendClick = useCallback(() => {
        const url = `${publicURL}/contact.php`;
        const formData: Record<string, string> = {
            name,
            subject,
            message
        };
        if (!isNullOrEmpty(email)) formData.email = email;
        $.post(url, formData).then(() => {
            setSent(true);
        });
    }, [name, subject, message, email]);

    if (sent) {
        return <div>
            Thank you for reaching out!
        </div>;
    }

    const sendDisabled = isNullOrEmpty(message) || isNullOrEmpty(name) || isNullOrEmpty(subject);

    return <div className={styles.contactForm}>
        <div className={styles.instructions}>
            Use this form to send a message to Kaliane.
        </div>
        <div>
            <input
                value={name}
                onChange={event => setName(event.target.value)}
                placeholder="your name"
                required={true}
            />
        </div>
        <div>
            <input
                value={subject}
                onChange={event => setSubject(event.target.value)}
                placeholder="subject"
                maxLength={40}
                required={true}
            />
        </div>
        <div>
            <input
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="your email (optional)"
            />
        </div>
        <div>
            <textarea
                value={message}
                onChange={event => setMessage(event.target.value)}
                placeholder={"your message"}
            />
        </div>
        <div>
            <button
                disabled={sendDisabled}
                onClick={onSendClick}
            >
                Send
            </button>
        </div>
    </div>;
}