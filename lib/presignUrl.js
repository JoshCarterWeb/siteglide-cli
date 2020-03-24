const fs = require('fs'),
	url = require('url'),
	request = require('request-promise'),
	mime = require('mime');

const Portal = require('./portal');
const deployServiceUrl = () => process.env.DEPLOY_SERVICE_URL || `${process.env.SITEGLIDE_URL}/api/private/urls`;

const presignUrl = (s3FileName, fileName) => {
	const serviceUrl = `${deployServiceUrl()}/presign-url`;
	const params = {
		fileName: s3FileName,
		contentLength: fs.statSync(fileName)['size'],
		contentType: mime.getType(fileName)
	};

	return request
		.get({
			url: serviceUrl,
			headers: {
				token: process.env.SITEGLIDE_TOKEN,
				marketplace_domain: url.parse(process.env.SITEGLIDE_URL).hostname,
				marketplace_endpoint: Portal.HOST
			},
			qs: params,
			json: true
		})
		.then(body => {
			return { uploadUrl: body.url, accessUrl: url.parse(body.accessUrl).href };
		});
};

const presignDirectory = (path) => {
	const serviceUrl = `${deployServiceUrl()}/presign-directory`;
	const params = { directory: path };

	return request
		.get({
			url: serviceUrl,
			headers: {
				token: process.env.SITEGLIDE_TOKEN,
				marketplace_domain: url.parse(process.env.SITEGLIDE_URL).hostname,
				marketplace_endpoint: Portal.HOST
			},
			qs: params,
			json: true
		})
		.then(body => {
			return body;
		});
};

module.exports = {
	presignUrl: presignUrl,
	presignDirectory: presignDirectory
};
