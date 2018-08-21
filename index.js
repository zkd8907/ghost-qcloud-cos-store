/**
 * Implement ghost stroage base using QCloud COS
 * @author Bobby(zkd8907@live.com)
 * The document of Ghost Cutstom Storage Moudle @see https://docs.ghost.org/docs/using-a-custom-storage-module
 */

'use strict';

const QCloudCOS = require('cos-nodejs-sdk-v5');
const GhostStorageBase = require('ghost-storage-base');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const statAsync = promisify(fs.stat);

class QCloudCOSAdapter extends GhostStorageBase {
    constructor(config) {
        super();
        this.config = config;
        this.cos = new QCloudCOS({
            SecretId: config.SecretId,
            SecretKey: config.SecretKey
        });
    }

    /**
     * Put an image to QCloud COS and return a full URI of it.
     * @param {object} image an image object with properites name and path.
     * @param {string=} targetDir a path to where to store the image.
     * @return {Promise<string>} A promise which resolves the full URI of the image.
     */
    async save (image, targetDir = this.getTargetDir('/')) {
        const config = this.config;

        try {
            const filename = await this.getUniqueFileName(image, targetDir);
            const state = await statAsync(image.path);

            return new Promise((resolve, reject) => {
                this.cos.putObject({
                    Bucket: config.Bucket,
                    Region: config.Region,
                    Key: filename,
                    ContentLength: state.size,
                    ContentType: image.mimetype,
                    Body: fs.createReadStream(image.path)
                }, (err) => {
                    if (err) {
                        console.error(`putObject err: ${err}`);
                        reject(err);
                        return;
                    }

                    resolve((config.staticDomain || '') + filename);
                });
            });
        } catch (err) {
            console.error(`getUniqueFileName err: ${err}`);
            return Promise.reject(err);
        }
    }

    /**
     * Check whether an image exists or not.
     * @param {string} filename the name of the file which is being uploaded.
     * @param {string=} targetDir the target dir of the file name. This is optional, ensure you first check if a custom dir was passed, otherwise fallback to the default dir/location of files.
     * @return {Promise<boolean>} A promise which resolves to true or false depending on whether or not the given image has already been stored.
     */
    exists (filename, targetDir = this.getTargetDir('/')) {
        const config = this.config;
        return new Promise((resolve) => {
            this.cos.headObject({
                Bucket: config.Bucket,
                Region: config.Region,
                Key: path.resolve(targetDir, filename)
            }, (err) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        });
    }

    /**
     * Returns a fucntion as the middleware for serving images.
     * @description 
     */
    serve () {
        return function (req, res, next) {
            next();
        }
    }

    /**
     * Delete an image from QCloud COS.
     * @param {string} filename the name of the file which is being uploaded.
     * @param {string=} targetDir the target dir of the file name. This is optional, ensure you first check if a custom dir was passed, otherwise fallback to the default dir/location of files.
     * @return {Promise<boolean>} A promise which resolves to true or false depending on whether or not the given image has already been stored.
     */
    delete (filename, targetDir = this.getTargetDir('/')) {
        const config = this.config;
        return new Promise((resolve, reject) => {
            this.cos.deleteObject({
                Bucket: config.Bucket,
                Region: config.Region,
                Key: path.resolve(targetDir, filename)
            }, (err) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        });
    }

    /**
     * Read bytes from QCloud COS for specified image.
     * @param {object} options An object including the information of the image.
     */
    read (options) {
        console.warn(`read is not implemented. ${options}`);
        return Promise.reject(new Error('Not Implemented.'));
    }
}

module.exports = QCloudCOSAdapter;