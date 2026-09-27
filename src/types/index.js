import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

// Re-create require for CommonJS packages like 'archiver'
const require = createRequire(import.meta.url);
const archiver = require('archiver');

// Get __dirname equivalent in ES Modules
const __dirname = import.meta.dirname;

/**
 * Compresses a source directory or file into a ZIP archive.
 *
 * @param {string} sourcePath - Path to the file or directory to compress.
 * @param {string} outputPath - Target path for the generated ZIP file.
 * @returns {Promise<void>}
 */
function createZipArchive(sourcePath, outputPath) {
    return new Promise((resolve, reject) => {
        // 1. Create a write stream for the output ZIP file
        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Maximum compression level
        });

        // 2. Listen for completion events
        output.on('close', () => {
            console.log(`ZIP file created successfully: ${outputPath}`);
            console.log(`Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
            resolve();
        });

        archive.on('warning', (err) => {
            if (err.code === 'ENOENT') {
                console.warn('Archive warning:', err);
            } else {
                reject(err);
            }
        });

        archive.on('error', (err) => {
            reject(err);
        });

        // 3. Pipe archive data to the output file stream
        archive.pipe(output);

        // 4. Append files or directory
        const stats = fs.statSync(sourcePath);
        if (stats.isDirectory()) {
            archive.directory(sourcePath, false); // false keeps root directory contents flat inside the ZIP
        } else if (stats.isFile()) {
            archive.file(sourcePath, { name: path.basename(sourcePath) });
        } else {
            return reject(new Error('Source path is neither a file nor a directory.'));
        }

        // 5. Finalize the archive (flush streams)
        archive.finalize();
    });
}

// Example usage
const sourceDir = path.join(__dirname, 'my_folder'); // Folder to zip
const zipOutput = path.join(__dirname, 'output.zip');  // Destination zip file

createZipArchive(sourceDir, zipOutput)
    .catch((err) => console.error('Error creating ZIP archive:', err));