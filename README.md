<div align="center">
<img width="256" alt="VSCord Logo" src="assets/icon.png" />
<!-- Icon -->
</div>

# Code RPC  

🚀 A free and open-source VSCode extension that brings your coding activity to Discord with Rich Presence.  

## ✨ Features  

- **🔗 Seamless Discord Integration** – Show what you're working on in VSCode directly in your Discord status!  
- **💻 Works Everywhere (even Cursor!)** – Compatible with VSCode and all its forks . If your IDE isn’t supported, feel free to submit a PR!  
- **⚙️ Fully Customizable** – Choose what details to display, hide, or tweak to fit your needs.  
- **🕒 Unique Idle Disconnect Setting** – Don't need to worry anymore about leaving your editor open anymore: automatically disconnect from Discord RPC when idle, reconnecting once activity resumes.  
- **🛠️ Supports 100+ Languages** – Whether you're coding in JavaScript, Python, Rust, or anything else, we’ve got you covered.  

## 🔀 Available Variables  

You can use **variables** inside any of the `upperText`, `lowerText`, or `imageText` fields to dynamically display details about your workspace, files, and editor. These variables will be replaced automatically at runtime.  

| Variable | Description |
|----------|-------------|
| `{{currentWorkspaceName}}` | The name of the current workspace. |
| `{{currentFileName}}` | The name of the currently open file (e.g., `index.js`). |
| `{{currentFilePath}}` | The absolute path to the currently open file. |
| `{{currentFileRelativePath}}` | The path to the currently open file relative to the workspace. |
| `{{currentFileExtension}}` | The extension of the currently open file (e.g., `.js`, `.py`). |
| `{{currentFileExtensionTruncated}}` | The file extension without the leading dot (e.g., `js`, `py`). |
| `{{currentEditorName}}` | The name of the active editor (e.g., "Visual Studio Code"). |
| `{{currentFileLine}}` | The current line number in the open file. |
| `{{currentFileLineCount}}` | The total number of lines in the open file. |
| `{{currentFileSize}}` | The size of the currently open file. |

#### 🛠 Example Usage  
```json
"code-rpc.activityOnFile": {
  "upperText": "Working on {{currentFileName}}",
  "lowerText": "Project: {{currentWorkspaceName}}",
  "imageText": "Editing a {{currentFileExtensionTruncated}} file"
}
```

## 📜 License  

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.  

## 🙌 Acknowledgements  

A huge shoutout to the [vscord](https://github.com/leonardssh/vscord) project for the inspiration and the language releated data—this extension wouldn’t exist without it! ❤️  
