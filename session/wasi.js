// Import necessary modules
import makeWASocket, { useSingleFileAuthState } from '@whiskeysockets/baileys';
import * as fs from 'fs';

// Load authentication state from a single JSON file
const { state, saveState } = useSingleFileAuthState('./creds.json');

// Function to connect to WhatsApp
async function wasidevsays() {
    // Create a socket connection
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true, // Print QR code in terminal
    });

    // Event listener for connection updates
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed due to', lastDisconnect.error, ', reconnecting:', shouldReconnect);
            if (shouldReconnect) {
                wasidevsays(); // Reconnect if not logged out
            }
        } else if (connection === 'open') {
            console.log('Connection opened');
        }
    });

    // Event listener for messages
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        console.log('Received message:', JSON.stringify(message, null, 2));

        // Reply to the message
        await sock.sendMessage(message.key.remoteJid, { text: 'Hello there!' });
    });

    // Save the authentication state whenever it updates
    sock.ev.on('creds.update', saveState);
}

// Run the connection function
wasidevsays();
