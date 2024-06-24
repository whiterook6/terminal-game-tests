import winston from "winston";
import path from "path";
import fs from "fs";

const getLogDirectory = (): string => path.join(__dirname, "/../logs");

export const clearLogs = () => {
    const logDirectory = getLogDirectory();
    if (fs.existsSync(logDirectory)) {
        fs.readdirSync(logDirectory).forEach((file) => {
            fs.unlinkSync(path.join(logDirectory, file));
        });
    }
}

export const buildLogger = () => {
    const logDirectory = getLogDirectory();
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
    }
    
    const logFilename = path.join(logDirectory, "output.log");
    return winston.createLogger({
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        transports: [new winston.transports.File({ filename: logFilename, level: "debug" })],
    });
};