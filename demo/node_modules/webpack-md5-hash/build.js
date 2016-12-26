#!/usr/bin/env node

"use strict";

var ArgumentParser = require('argparse').ArgumentParser;
var version = require('./package.json').version;
var versions = require('./versions.json');
var fs = require('fs');
var path = require('path');


var parser = new ArgumentParser({
    version: version,
    addHelp: true,
    description: 'WebPack md5 build tools'
});

var subparsers = parser.addSubparsers({
    title: 'commands',
    dest: "Build commands"
});

var gen_docker_parser = subparsers.addParser('gen_docker', {
    addHelp: true
});

gen_docker_parser.addArgument(
    ['-t', '--template'],
    {
        help: 'Dockerfile template',
        action: 'store',
        required: false,
        defaultValue: './dockerfiles/Dockerfile'
    }
);


main(parser.parseArgs());

function main(args) {
    if (args['Build commands'] === 'gen_docker') {
        gen_docker(args);
    }
}

function gen_docker(args) {
    var dockerfiles = './dockerfiles';
    if (!fs.existsSync(args.template)) {
        console.error('No such file: ' + args.template);
    }
    var dockerComposeTemplate = fs.readFileSync('./docker-compose.template').toString();
    var dockerCompose = '';
    for (var node_version_key in versions.node_version) {
        for (var webpack_version_key in versions.webpack_version) {
            var node_version = versions.node_version[node_version_key];
            var webpack_version = versions.webpack_version[webpack_version_key];
            var name = 'n_' + node_version + '_w_' + webpack_version;
            var newPath = path.join(dockerfiles, name);
            if (!fs.existsSync(newPath)){
                fs.mkdirSync(newPath);
            }
            var template = fs.readFileSync(args.template).toString();
            var dcokerFile = template.replace(/\{node_version\}/g, node_version).replace(/\{webpack_version\}/g, webpack_version);
            fs.writeFileSync(path.join(newPath, 'Dockerfile'), dcokerFile);
            var composePart = dockerComposeTemplate.replace(/\{name\}/g, name);
            dockerCompose += composePart;
        }
    }
    fs.writeFileSync('./docker-compose.yml', dockerCompose);
}
