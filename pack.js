const {Asarmor, FileCrash, Trashify, Bloat} = require('asarmor');
const { join } = require("path");

exports.default = async ({ appOutDir, packager }) => {
  try {
    const asarPath = join(packager.getResourcesDir(appOutDir), 'app.asar');
    console.log(`applying asarmor protections to ${asarPath}`);
    const asarmor = new Asarmor(asarPath);
    asarmor.applyProtection(new Trashify(['.git', '.env', '.vscode', '.idea', '.env.local']));
    asarmor.applyProtection(Trashify.Randomizers.randomExtension(['js', 'ts', 'txt']));
    asarmor.applyProtection(new Bloat(20));
    await asarmor.write(asarPath);
  } catch (err) {
    console.error(err);
  }
};