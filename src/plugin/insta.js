import axios from 'axios';

const instaDownload = async (message, replyFunction) => {
    const commandMatch = message.body.match(/^[\\/!#.]/);
    const commandPrefix = commandMatch ? commandMatch[0] : '/';
    const command = message.body.startsWith(commandPrefix) 
        ? message.body.slice(commandPrefix.length).split(" ")[0].toLowerCase() 
        : '';
    const urlToDownload = message.body.slice(commandPrefix.length + command.length).trim();

    const validCommands = ["insta", "ig", "igdl", "instadl"];
    if (validCommands.includes(command)) {
        if (!urlToDownload) {
            return replyFunction("Please provide an Instagram URL.");
        }
        
        try {
            await message.react('🕘');
            const apiUrl = `https://api.giftedtech.us.kg/api/download/instadl?apikey=YOUR_API_KEY&url=${encodeURIComponent(urlToDownload)}`;
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (data.success && data.result.length > 0) {
                const mediaUrl = data.result[0].url;
                await replyFunction.sendMedia(message.from, mediaUrl, "file", "© Powered By KHAN-MD", message);
                await message.react('✅');
            } else {
                throw new Error("Invalid response from the downloader.");
            }
        } catch (error) {
            console.error("Error downloading Instagram media:", error.message);
            await replyFunction("Error downloading Instagram media.");
            await message.react('❌');
        }
    }
};

export default instaDownload;
