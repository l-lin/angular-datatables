#!/bin/bash

# Exit the script if a command fails
set -e

function info {
    echo "[-] $1"
}

function help {
    echo "[x] Missing arguments..."
    info "Usage: $  deploy-doc.sh <version>"
    info "Example:"
    info "  $ deploy-doc.sh 2.0.0"
}

if [ -z "$1" ]; then
    help
    exit 1
fi

version=${1}
gitmessage="Deploy documentation $version to gh-pages"
cwd=$(pwd)
project_name=${PWD##*/}

info "Deloying the documentation to the GH pages from $cwd (project name is $project_name)"

info "Building documentation..."
cd $cwd/demo
npm run build:prod

info "Copying the doc folder to /tmp"
rm -rf /tmp/angular-datatables-demo
cp -r dist /tmp/angular-datatables-demo
cd /tmp/angular-datatables-demo

info "Copying project to /tmp and switch to gh-pages branch"
rm -rf /tmp/$project_name
cp -r $cwd /tmp
cd /tmp/$project_name
git add -A && git stash
git checkout gh-pages
git fetch && git reset --hard origin/gh-pages

info "Remove all files except .git"
rm -rf *

info "Copy the doc to the gh-pages branch"
cp -r /tmp/angular-datatables-demo/* /tmp/$project_name

info "Download archives vendor from angular1 branch"
cd /tmp
rm -rf angular-datatables-angular1
wget https://github.com/l-lin/angular-datatables/archive/angular1.zip
unzip angular1.zip
cp -r angular-datatables-angular1/vendor $project_name/archives

info "Commit gh-pages"
cd /tmp/$project_name
git add -A && git commit -m "$gitmessage"

info "Pushing to remote"
git push -u origin gh-pages

info "Removing tmp folders"
rm -rf /tmp/$project_name
rm -rf /tmp/angular-datatables-demo

info "Github Pages deployed SUCCESSFULLY!!!"

exit 0
