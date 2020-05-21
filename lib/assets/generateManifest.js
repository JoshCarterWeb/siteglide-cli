const fs = require('fs'),
	files = require('../assets/files');
dir = require('../directories');

const appDirectory = fs.existsSync(dir.APP) ? dir.APP : dir.LEGACY_APP;

const serializerManifestEntry = file => {
	const fileUpdatedAt = Math.floor(new Date(fs.statSync(file)['mtime']) / 1000);
	return { physical_file_path: file.replace(new RegExp(`^${appDirectory}/`), ''), updated_at: fileUpdatedAt };
};

const manifestGenerate = async () => {
	const assets = await files.getAssets();
	return manifestGenerateForAssets(assets);
};

const manifestGenerateForAssets = (assets) => {
	let manifest = {};
	for (const file of assets) {
		const path = file.replace(new RegExp(`(public|private)/assets/|(${appDirectory})/assets/`), '');
		manifest[path] = serializerManifestEntry(file);
	}

	return manifest;
};

module.exports = {
	manifestGenerate: manifestGenerate,
	manifestGenerateForAssets: manifestGenerateForAssets
};
