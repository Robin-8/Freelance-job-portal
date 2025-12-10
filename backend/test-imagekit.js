require("dotenv").config();
const imagekit = require("./utils/imagekit");

(async () => {
  try {
    console.log(
      "Using IMAGEKIT_URL_ENDPOINT:",
      process.env.IMAGEKIT_URL_ENDPOINT
    );
    console.log(
      "Using IMAGEKIT_PUBLIC_KEY:",
      !!process.env.IMAGEKIT_PUBLIC_KEY
    );

    // 1x1 transparent PNG
    const base64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=";
    const dataUri = "data:image/png;base64," + base64;

    const result = await imagekit.upload({
      file: dataUri,
      fileName: "test_upload_" + Date.now() + ".png",
      folder: "/freelancer-profiles",
    });

    console.log("Upload success:", result);
  } catch (err) {
    const util = require("util");
    console.error("Upload failed (full error):");
    console.error(util.inspect(err, { showHidden: true, depth: null }));
    if (err && err.response)
      console.error(
        "Response:",
        util.inspect(err.response, { showHidden: true, depth: null })
      );
    process.exit(1);
  }
})();
