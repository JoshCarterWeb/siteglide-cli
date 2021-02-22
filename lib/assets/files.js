const fs = require('fs');
	glob = require('globby'),
	path = require('path'),
	logger = require('../logger'),
	dir = require('../directories');

const config = {
  CONFIG: '.siteglide-config',
  LEGACY_CONFIG: '.siteglide-config',
};

const _paths = customConfig => [customConfig, config.CONFIG, config.LEGACY_CONFIG];

const _getAssets = async () => {
	const appAssets = fs.existsSync(`${dir.LEGACY_APP}/assets`) ? await glob(`${dir.LEGACY_APP}/assets/**`) : [];

	return [...appAssets] || [];
};

const _getConfigPath = customConfig => {
  const firstExistingConfig = _paths(customConfig).filter(fs.existsSync)[0];
  logger.Debug(`[_getConfigPath] First existing config file: ${firstExistingConfig}`);
  return path.resolve(firstExistingConfig || config.CONFIG);
};

const _readJSON = (filePath, opts = { exit: true }) => {
  if (fs.existsSync(filePath)) {
    logger.Debug(`[_readJSON] File exist: ${filePath}.`);

    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });

    try {
      return JSON.parse(fileContent);
    } catch (error) {
      logger.Debug(`${error.message}`);
      logger.Error(`${filePath} is not a valid JSON file. Use https://jsonlint.com to lint your JSON syntax.`, {
        exit: false
      });
      logger.Error(`Error thrown by the parser: ${error.message}`, { exit: opts.exit });
    }
  } else {
    logger.Debug(`[_readJSON] File doesnt exist: ${filePath}`);
    return {};
  }
};

module.exports = {
  readJSON: _readJSON,
	getAssets: _getAssets,
	getConfigPath: _getConfigPath,
  getConfig: () => {
    const configPath = _getConfigPath(process.env.CONFIG_FILE_PATH);
    logger.Debug(`[getConfig] Looking for config in: ${configPath}`);
    return _readJSON(configPath) || {};
  },
};