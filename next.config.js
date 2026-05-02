/**
 * Next.js config: ignore a non-fatal webpack cache warning on Windows
 * caused by drive-letter path-casing differences. This avoids noisy
 * developer console output while keeping the filesystem cache enabled.
 */
module.exports = {
  webpack(config, { dev }) {
    if (dev) {
      config.ignoreWarnings = config.ignoreWarnings || [];
      config.ignoreWarnings.push((warning) => {
        const msg = warning && (warning.message || warning.stack || '');
        if (!msg) return false;
        // Match the PackFileCacheStrategy / FileSystemInfo casing warning
        return /webpack\.cache\.PackFileCacheStrategy\/webpack\.FileSystemInfo/.test(msg)
          || /Resolving '[^']*typescript[^']*'/.test(msg);
      });
    }
    return config;
  },
};
