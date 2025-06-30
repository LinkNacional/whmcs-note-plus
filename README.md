# whmcs-note-plus

## Requirements and Support
- PHP: 8.1
- WHMCS: 8.0+

## Development Notes

### Setting up the development environment

- Rename `devcontainer.example.json` to `devcontainer.json` and enter the path on your machine to the WHMCS stubs.
- Rename `sftp.example.json` to `sftp.json` and enter your personal FTP credentials for the test WHMCS.
- Run `composer install`
- Run `npm install`
- Run `npm start` - starts a listener for Webpack and Tailwind

Note: `sftp.json` is configured to watch changes in all project files and automatically upload them when modified.
Running `npm run build` under `src/client/` places the build files into `src/modules/addons/lknnoteplus/src/assets/`, which are
automatically sent via FTP on each change.

## Installation Instructions
1. Download the module's .zip file.
2. It is recommended that you delete the previous version of the module from your WHMCS.
3. Extract and upload the new version files to your WHMCS, into the `/modules/addons/` folder.

## Configuration
1. In the WHMCS Addon Modules configuration page, enable the "Note Plus" module.
2. Grant Access Control to "Full Administrator", or the desired group, and click "Save".

## Usage Instructions
1. In the top menu of WHMCS, go to Addons > Note plus.
2. Start by adding a new list.
3. Add a new card.
4. Click on the newly added card.
5. Start creating notes.

## Features
- List creation
- Card creation
- Note creation
