export function validateModName(name) {
  const errors = [];
  if (name.length < 3) {
    errors.push("Mod name must be atleast 3 characters long");
  }
  if (name.length > 24) {
    errors.push("Mod name is too long");
  }
  if (name.search(/^[a-z0-9]+$/i) < 0) {
    errors.push("Mod name must contain only alphanumeric characters");
  }
  const allowedPattern = /^[a-zA-Z0-9,.¡!¿?$%&()#+;'" _-]+$/;
  if (!allowedPattern.test(name)) {
    errors.push(
      "Mod name must only contain letters, numbers, spaces, dashes and underscores"
    );
  }
  return errors;
}

export function validateShortDescription(shortDescription) {
  const errors = [];
  if (shortDescription.length < 20) {
    errors.push("Mod description preview must be atleast 20 characters long");
  }
  if (shortDescription.length > 84) {
    errors.push("Mod description preview exceed limit of 84 characters");
  }
  return errors;
}

export function validateModVersion(modVersion) {
  const errors = [];
  const re = /^\d+\.\d+\.\d+$/;
  if (!re.test(modVersion)) {
    errors.push("Invalid mod version, should follow n.n.n format");
  }
  return errors;
}

function bytesToMB(bytes) {
  return bytes / (1024 * 1024);
}

export function validateThumbnail(thumbnail) {
  const errors = [];
  const THUMBNAIL_SIZE_LIMIT = 2;

  const thumbExt = thumbnail.name.split(".").pop();
  if (thumbExt !== "png" && thumbExt !== "jpg" && thumbExt !== "jpeg") {
    errors.push("Thumbnail file must be a png or jpg file.");
  }
  if (bytesToMB(thumbnail.size) > THUMBNAIL_SIZE_LIMIT) {
    errors.push(
      `Thumbnail size exceeds the limit of ${THUMBNAIL_SIZE_LIMIT}MB.`
    );
  }
  return errors;
}

export function validateModFile(modFile) {
  const errors = [];
  const ZIP_FILE_LIMIT = 25;

  const modExt = modFile.name.split(".").pop();
  if (modExt !== "zip") {
    errors.push("Mod file must be a zip file.");
  }
  if (bytesToMB(modFile.size) > ZIP_FILE_LIMIT) {
    errors.push(`Mod file size exceeds the limit of ${ZIP_FILE_LIMIT}MB.`);
  }
  return errors;
}
