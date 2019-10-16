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
    2. Pending
        - Function import and export json files.
        - Combine imported json files to create the tree.
        - Remove a key of all files or one file.
        - Create the key for all files or one file.
        - Show content of combine json files, if one file is missing the key the content
        of this file should show the plus icon or something to add this key to the file.
        
# How to use
- This project use angular to `serve` the app. So you need to install some Angular
required, and then `serve` it with command:
> ng serve or npm run start


