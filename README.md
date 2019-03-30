# Ghost QCloud(TencentYun) COS Storage

This is an implement of [Ghost custom storage module](https://docs.ghost.org/docs/using-a-custom-storage-module)  allows you to store images over [QCloud](https://cloud.tencent.com/product/cos) instead of local disk.

## Supported

This module works well with 1.x. I haven't test it on 0.x. If you have any problem, please submit an issue.

## Installation

### Via NPM

- Install `ghost-qcloud-cos-store`

  ```
  npm install ghost-qcloud-cos-store
  ```

- Go to `ghost/content/adapters/storage`. If `content` folder is empty, create the folders first.

- Create a file named `qcloud-cos-store.js` with the content blow:

  ```javascript
  module.exports = require('ghost-qcloud-cos-store');
  ```


### Via Git

- Go to `ghost/content/adapters/storage`. If `content` folder is empty, create the folders first.

- Clone this repo to `storage`

  ```
  cd ghost/content/adapters/storage
  git clone https://github.com/zkd8907/ghost-qcloud-cos-store.git qcloud-cos-store
  ```

- Install dependencies

  ```
  cd qcloud-cos-storage
  npm install
  ```

## Configuration

Edit `ghost/config.production.json` and add a new `storage` key to specify the custom storage.

```javascript
{
  ...
  "storage": {
    "active": "qcloud-cos-store",
    "qcloud-cos-store": {
      "Bucket": "{BucketName}-{AppId}",
      "Region": "{BucketRegion}",
      "SecretId": "{SecretId}",
      "SecretKey": "{SecretKey}",
      "staticDomain": "https://static.zkd.me"
    }
  }
}
```

All the keys are necessary except `staticDomain`.

The value of `active` must be the same with the name of the file(Via NPM) or the folder(Via Git) in `ghost/content/adapters/storage`. You can find your Bucket Name, Appid, SecureId and SecureKey at [your console](https://console.cloud.tencent.com/cos/secret) of QCloud. The all regions are listed at https://cloud.tencent.com/document/product/436/6224.

`staticDomain` is optional. Normally, you need to specify a CDN domain to visit the full URL starts with http or https.
## License

Read [LICENSE](LICENSE)