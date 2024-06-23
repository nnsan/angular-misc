const fs = require('fs');
const readline = require('readline');
const path = require('path');
const os = require('os');

// Input dump file
const inputFile = 'your-dump-file.sql';

// Output directory
const outputDir = 'output';

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Create a read stream for the input file
const readStream = fs.createReadStream(inputFile);
const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
});

// Regular expressions to match SQL statement types
const regexMap = {
    tables: /^CREATE\s+TABLE\s+(\w+\.\w+)/i,
    views: /^(?:CREATE|CREATE OR REPLACE)\s+VIEW\s+(\w+\.\w+)/i,
    trigger_functions: /^(?:CREATE|CREATE OR REPLACE)\s+FUNCTION\s+(\w+\.\w+).+RETURNS\s+TRIGGER/i,
    functions: /^(?:CREATE|CREATE OR REPLACE)\s+FUNCTION\s+(\w+\.\w+)/i,
    procedures: /^(?:CREATE|CREATE OR REPLACE)\s+PROCEDURE\s+(\w+\.\w+)/i,
    triggers: /^CREATE\s+TRIGGER\s+(\w+)/i,
    alert: /^ALTER\s+(?:TABLE|TABLE ONLY)\s+(\w+\.\w+)/,
    comment: /^COMMENT ON\s+(?:TABLE|COLUMN|CONSTRAINT)\s+(\w+\.\w+)/,
    index: /^CREATE\s+(?:INDEX|UNIQUE INDEX)\s+\w+\s+ON\s+(\w+\.\w+)/,
    grant: /^GRANT\s+SELECT\s+ON\s+(?:TABLE)\s+(\w+\.\w+)/
};

// Variables to keep track of the current statement type and statement buffer
let currentStatementType = null;
let statementBuffer = [];
let fileName = '';

const orderStatement = {
    index: new Map(),
    comment: new Map(),
    grant: new Map()
};

// Function to write the buffered statement to a new file
function writeStatementToFile(statement, fileName) {
    const filePath = path.join(outputDir, fileName);
    const directoryPath = path.dirname(filePath);

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
        console.log(`Directory ${directoryPath} created.`);
    }

    fs.appendFileSync(filePath, statement.join(os.EOL) + os.EOL);
}

function getObjectName(regex, line) {
    const results = regex.exec(line);
    const [schema, name] = results[1].split('.');
    return name || schema;
}

function searchFile(directory, targetFile) {
    const items = fs.readdirSync(directory);

    for (const item of items) {
        const itemPath = path.join(directory, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            // Recursively search in subdirectories
            const foundPath = searchFile(itemPath, targetFile);
            if (foundPath) {
                return foundPath;
            }
        } else if (item === targetFile) {
            return directory;
        }
    }

    return null;
}

function getFilePath(objectType, fileName) {
    if (['views', 'tables', 'functions', 'triggers', 'trigger_functions', 'procedures'].includes(objectType)) {
        return path.join(objectType, fileName);
    }

    const directory = searchFile(outputDir, fileName);
    if (directory) {
        const fullPath = path.join(path.relative(outputDir, directory), fileName);
        return fullPath;
    } else {
        console.error(fileName, objectType);
    }
}

// Function to check if the statement has ended
function isEndOfStatement(line, type) {
    if (['functions', 'procedures', 'trigger_functions'].includes(type)) {
        return /(?:LANGUAGE sql;|\$\$;|\$_\$;)/.test(line);
    }
    return /;/.test(line);
}

function processStatement(regex, line) {
    fileName = getFilePath(currentStatementType, `${getObjectName(regex, line)}.sql`);
    if (statementBuffer.length > 0) {
        writeStatementToFile(statementBuffer, fileName);
        statementBuffer = [];
    }
}

function processOrderStatement(regex, line) {
    fileName = getFilePath(currentStatementType, `${getObjectName(regex, line)}.sql`);

    if (statementBuffer.length > 0) {
        const statement = orderStatement[currentStatementType];
        statement.get(fileName).push(statementBuffer);
        statementBuffer = [];
    }
}

// Process each line of the file
rl.on('line', (line) => {
    if (regexMap.tables.test(line)) {
        currentStatementType = 'tables';
        processStatement(regexMap.tables, line);
    } else if (regexMap.alert.test(line)) {
        currentStatementType = 'alert';
        processStatement(regexMap.alert, line);
    } else if (regexMap.comment.test(line)) {
        currentStatementType = 'comment';
        processOrderStatement(regexMap.comment, line);
    } else if (regexMap.index.test(line)) {
        currentStatementType = 'index';
        processOrderStatement(regexMap.index, line);
    } else if (regexMap.grant.test(line)) {
        currentStatementType = 'grant';
        processOrderStatement(regexMap.grant, line);
    } else if (regexMap.views.test(line)) {
        currentStatementType = 'views';
        processStatement(regexMap.views, line);
    } else if (regexMap.trigger_functions.test(line)) {
        currentStatementType = 'trigger_functions';
        processStatement(regexMap.trigger_functions, line);
    } else if (regexMap.functions.test(line)) {
        currentStatementType = 'functions';
        processStatement(regexMap.functions, line);
    } else if (regexMap.procedures.test(line)) {
        currentStatementType = 'procedures';
        processStatement(regexMap.procedures, line);
    } else if (regexMap.triggers.test(line)) {
        currentStatementType = 'triggers';
        processStatement(regexMap.triggers, line);
    }

    if (currentStatementType) {
        statementBuffer.push(line);
        if (isEndOfStatement(line, currentStatementType)) {
            if (Object.keys(orderStatement).includes(currentStatementType)) {
                const statementMap = orderStatement[currentStatementType];
                if (statementMap.has(fileName)) {
                    statementMap.get(fileName).push(statementBuffer);
                } else {
                    statementMap.set(fileName, [os.EOL, statementBuffer])
                }
            } else {
                writeStatementToFile(statementBuffer, fileName);
            }
            statementBuffer = [];
            currentStatementType = null;
        }
    }

});

// Handle end of file
rl.on('close', () => {
    if (statementBuffer.length > 0) {
        writeStatementToFile(currentStatementType, statementBuffer, 'abc');
    }

    Object.values(orderStatement).forEach((statementMap) => {
        if (statementMap.size > 0) {
            statementMap.forEach((buffer, objectName) => {
                writeStatementToFile(buffer, objectName);
            });
        }
    });

    console.log('SQL statements have been split into separate files.');
});
