# Introduction

- This project support update value of **i18n**. I provide some tools as `replace Json`,
`Json tree` to help us save time when working with *Angular multilingual*

# Function

1. Replace json file
- Update value of json file with the format of **i18n**. This update just update
 the value, the new key will not append when replace.
2. Json tree
- The purpose of this function is update all files of **i18n** in your project with
the display of tree, and language content when you choose a node.

# Project progress

1. Replace json file
    1. Finish
        - Finish the function of replace value between two json file
    2. Pending
        - Write to file after replace, and add button download.
        - Show diff between two file (original and result)
        - Design front-end better.
2. Json tree
  1. Finish
    - Show tree of json file and show content of node when choose key.
    - Combine imported json files to create the tree.
    - Remove a key of all files or one file.
    - Show content of combine json files, if one file is missing the key the content
    of this file should show the plus icon or something to add this key to the file.
    - Implement rename for a node
    - Function import and export json files.
    - Create the key for all files or one file.
    - Create overlay to add a new key which can choose the default value for each file.
  2. Pending
     - Allow adding a new node without any file and node initialized
  3. Progress
    - Support multi tenant
       
# How to use

- This project use angular to serve the app, so you need to install the `node_modules` by command
> npm i
- Then run the command to build angular source code, and using electron to serve the source by command
> npm run angular:integrate
> 
> npm run electron:integrate

- Running `npm run start` to get the default for the developer, but you can not interact with files(that means you can't import and export file).

- To run automation test:;
> ng e2e

# Project apply

1. Lazy loading component.
2. Automation test.
3. Angular material.
