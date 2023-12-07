//
// config.js
//
// Web service configuration parameters, separate
// from our tennishub-config file that contains 
// AWS-specific configuration information.
//

const config = {
  tennishub_config: "tennishub-config.ini",
  tennishub_profile: "s3readwrite",
  service_port: 8080,
  page_size: 12
};

module.exports = config;
