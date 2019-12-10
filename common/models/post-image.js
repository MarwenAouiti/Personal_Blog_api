"use strict";

// we installed sharp to allow us to make modification on the Image
// while uploading it ==> we will create two version of our PostImage
// one we will use as thumbnail and the other we will use ad post image
const sharp = require("sharp");
const fs = require("fs"); // allow access to file system

const CONTAINER_URL = "/api/ImageFiles/";

module.exports = function(PostImage) {
  PostImage.upload = function(
    ctx,
    options,
    access_token,
    post_id,
    user_id,
    cb
  ) {
    if (!options) {
      options = {};
    }
    ctx.req.params.container = "PostImages";
    if (!fs.existsSync("./server/storage/" + ctx.req.params.container)) {
      fs.mkdirSync("./server/storage/" + ctx.req.params.container);
    }
    PostImage.find({ where: { postId: post_id } }, (fer, files) => {
      if (!fer && files) {
        files.map(fil => {
          fil.updateAttributes({ postId: null });
        });
      }
    });
    PostImage.app.models.ImageFile.upload(
      ctx.req,
      ctx.result,
      options,
      (err, file) => {
        if (err) {
          cb(err);
        } else {
          var fileInfo = file.files.file[0];
          sharp(
            "./server/storage/" + ctx.req.params.container + "/" + fileInfo.name
          )
            .resize(200, 200)
            .toFile(
              "./server/storage/" +
                ctx.req.params.container +
                "/100-" +
                fileInfo.name,
              err => {
                if (!err) {
                  PostImage.create(
                    {
                      url:
                        CONTAINER_URL +
                        fileInfo.container +
                        "/download/" +
                        fileInfo.name,
                      thumbnail:
                        CONTAINER_URL +
                        fileInfo.container +
                        "/download/100-" +
                        fileInfo.name,
                      created_at: new Date(),
                      postId: post_id,
                      userId: user_id
                    },
                    (err2, image) => {
                      if (err2) {
                        cb(err1);
                      } else {
                        cb(null, image);
                      }
                    }
                  );
                }
              }
            );
        }
      }
    );
  };

  PostImage.remoteMethod("upload", {
    description: "uploads a file",
    accepts: [
      { arg: "ctx", type: "object", http: { source: "context" } },
      { arg: "options", type: "object", http: { source: "query" } },
      { arg: "access_token", type: "string" },
      { arg: "post_id", type: "string" },
      { arg: "user_id", type: "string" }
    ],
    returns: {
      arg: "fileObject",
      type: "object",
      route: true
    },
    http: { verb: "post" }
  });
};
