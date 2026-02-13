import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getApiBase } from '../utils/apiBase';

const WhatsAppModal = ({ show, onHide, recipientName, mobileNumber }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        setLoading(true);
        try {
            const base = getApiBase();
            const res = await fetch(`${base}/api/whatsapp/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: mobileNumber, message })
            });
            let data;
            const text = await res.text();
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Server returned non-JSON:", text);
                throw new Error("Server returned invalid response: " + text.substring(0, 50));
            }

            if (data.success) {
                alert('Message sent successfully!');
                setMessage('');
                onHide();
            } else {
                alert('Failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
            alert('Error sending message: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Send WhatsApp to {recipientName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Message</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={5} 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
                <Button variant="success" onClick={handleSend} disabled={loading || !message}>
                    {loading ? 'Sending...' : 'Send WhatsApp'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WhatsAppModal;
