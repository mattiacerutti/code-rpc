export const EXTENSION_NAME = "code-rpc";

export const MIN_IDLE_TIMEOUT = 20;

/* Default values for settings */
export const DEFAULT_IDLE_TIMEOUT = 5 * 60;
export const DEFAULT_DISCONNECT_ON_IDLE = false;
export const DEFAULT_RETRY_CONNECTION = true;
export const DEFAULT_RESET_ELAPSED_TIME_ON_IDLE = false;
export const DEFAULT_IDLE_IMAGE = "https://raw.githubusercontent.com/mattiacerutti/code-rpc/main/assets/idle.png";
export const DEFAULT_DEBUGGING_IMAGE = "https://raw.githubusercontent.com/mattiacerutti/code-rpc/main/assets/debugging.png";
export const DEFAULT_PLACEHOLDER_IMAGE = "https://raw.githubusercontent.com/mattiacerutti/code-rpc/main/assets/placeholder.png";
export const DEFAULT_LANGUAGE_IMAGE_TEMPLATE = "https://raw.githubusercontent.com/mattiacerutti/code-rpc/main/assets/languages/{{language}}.png";
export const DEFAULT_IDE_IMAGE_TEMPLATE = "https://raw.githubusercontent.com/mattiacerutti/code-rpc/main/assets/ide/{{ide}}.png";

/* Default values for activity templates */
export const DEFAULT_ACTIVITY_ON_FILE_NO_WORKSPACE = {
  upperText: "Editing {{currentFileName}}",
  lowerText: null,
  imageText: "Editing a {{currentFileExtensionTruncated}} file",
};
export const DEFAULT_ACTIVITY_ON_FILE = {
  upperText: "Editing {{currentFileName}}",
  lowerText: "In workspace: {{currentWorkspaceName}}",
  imageText: "Editing a {{currentFileExtensionTruncated}} file",
};
export const DEFAULT_ACTIVITY_ON_WORKSPACE = {
  upperText: "No file currently open",
  lowerText: "In workspace: {{currentWorkspaceName}}",
  imageText: null,
};
export const DEFAULT_ACTIVITY_ON_EDITOR = {
  upperText: "No project currently open",
  lowerText: "In the editor",
  imageText: null,
};
export const DEFAULT_ACTIVITY_ON_DEBUGGING = {
  upperText: "Debugging {{currentFileName}}",
  lowerText: "Debugging {{currentFileName}}",
  imageText: null,
};
export const DEFAULT_ACTIVITY_ON_IDLE = {
  upperText: "Inactive..",
  lowerText: null,
  imageText: "💤",
};
